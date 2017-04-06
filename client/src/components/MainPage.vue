<template>
  <div class="main-page">
    <md-tabs class="md-transparent"
             md-elevation="1"
             ref="mainTabs"
             @change="onMainTabChanged">
      <md-tab id="workspaces" md-label="Workspaces">
        <create-workspace-modal-form @create="workspaceCreated"></create-workspace-modal-form>

        <div>
          <div class="workspace-wrapper" v-for="workspace in workspacesCards" :key="workspace.id">
            <workspace-card :itemId="workspace.id"
                            :title="workspace.name"
                            :description="workspace.description"
                            :iconSrc="workspace.descriptionImage"
                            @open="goToWorkspace"
                            @edit="editWorkspace"
                            @remove="deleteWorkspace">
            </workspace-card>
          </div>
        </div>
      </md-tab>

      <md-tab id="workspace" md-label="Workspace">
        <md-tabs md-fixed
                 ref="workspaceTabs"
                 @change="onMainTabChanged">
          <md-tab v-for="workspace in workspaces" :key="workspace.id" :id="workspace.id" :md-label="workspace.name">
            <md-layout md-gutter="8">
              <md-layout md-flex="true">
                <md-whiteframe md-elevation="3">
                  <create-source-modal-form :workspaceId="workspace.id" @create="sourceCreated"></create-source-modal-form>
                  <ul>
                    <li v-for="source in workspace.sources" :key="source.id">
                      {{ source.name }}
                      <md-button class="md-fab md-mini"
                                 @click.native="removeSource(source.id)">>
                        <md-icon>delete</md-icon>
                      </md-button>
                    </li>
                  </ul>
                </md-whiteframe>
              </md-layout>
              <md-layout md-flex="true">
                <md-whiteframe md-elevation="3">
                  <create-core-modal-form :workspaceId="workspace.id" @create="coreCreated"></create-core-modal-form>
                  <core v-for="core in workspace.cores" :key="core.id" :coreData="core"></core>
                </md-whiteframe>
              </md-layout>
              <md-layout md-flex="true">
                <md-whiteframe md-elevation="3">
                  <create-sink-modal-form :workspaceId="workspace.id"  @create="sinkCreated"></create-sink-modal-form>
                  <ul>
                    <li v-for="sink in workspace.sinks" :key="sink.id">
                      {{ sink.name }}
                      <md-button class="md-fab md-mini"
                                 @click.native="removeSink(sink.id)">>
                        <md-icon>delete</md-icon>
                      </md-button>
                    </li>
                  </ul>
                </md-whiteframe>
              </md-layout>
            </md-layout>
          </md-tab>
        </md-tabs>
      </md-tab>

      <md-tab id="cores" md-label="Cores">

      </md-tab>

      <md-tab id="sources" md-label="Sources"></md-tab>

      <md-tab id="sinks" md-label="Sinks"></md-tab>

    </md-tabs>
  </div>
</template>

<script>
    import Vue from 'vue';
    import { mapGetters, mapMutations } from 'vuex';
    import WorkspaceCard from './workspace/WorkspaceCard.vue';
    import CreateWorkspaceModalForm from './workspace/CreateWorkspaceModalForm.vue';
    import CreateCoreModalForm from './workspace/CreateCoreModalForm.vue';
    import CreateSourceModalForm from './workspace/CreateSourceModalForm.vue';
    import CreateSinkModalForm from './workspace/CreateSinkModalForm.vue';
    import Core from './workspace/Core.vue';

    export default {
        name: 'mainPage',
        components: {
            CreateWorkspaceModalForm,
            CreateCoreModalForm,
            CreateSourceModalForm,
            CreateSinkModalForm,
            Core,
            WorkspaceCard
        },
        data () {
            return {
                workspacesCards: [],
                workspaceIdToOpen: undefined,
                workspaces: []
            }
        },
        methods: {
            updateWorkspacesList: function () {
                this.$http.get('api/Workspaces', {
                    params: {
                        filter: {
                            where: {
                                accountId: this.getUserId()
                            }
                        }
                    }
                }).then(response => {
                    if (response.ok) {
                        this.workspacesCards = response.json();
                    }
                }, err => {
                    debugger;
                });
            },
            editWorkspace: function (id) {
                console.log(id);
            },
            deleteWorkspace: function (id) {
                let removedWorkspaceIndex = this.workspacesCards.findIndex(function (workspace) {
                    return workspace.id === id;
                });

                if (removedWorkspaceIndex > -1) {
                    this.workspacesCards.splice(removedWorkspaceIndex, 1);
                }
            },
            goToWorkspace: function (id) {
                this.workspaceIdToOpen = id;
                this.$refs['mainTabs'].setActiveTab({
                    id: 'workspace'
                });
            },
            onMainTabChanged: function (tabIndex) {
                let me = this;
              switch (tabIndex) {
                case 0:

                  break;
                case 1:
                  if (this.workspaceIdToOpen) {
                    this.$http.get('api/Workspaces/' + me.workspaceIdToOpen, {
                        params: {
                            filter: '{"include": [{"cores":["valueHolders"]}, "sources", "sinks"]}'
                        }
                    }).then(function (response) {
                      if (response.ok) {

                        if (!this.workspaces.find(function (workspace) {
                            return workspace.id === me.workspaceIdToOpen;
                          })) {
                          this.workspaces.push(response.data);
                        }

                        me.workspaceIdToOpen = undefined;
                      }
                    }, function (err) {
                      console.log('Error while loading workspace with artifacts');
                      me.workspaceIdToOpen = undefined;
                    });
                  }
                  break;
                case 2:

                  break;
                case 3:

                  break;
                case 4:

                  break;
              }
            },
            onWorkspaceTabChanged: function (tabIndex) {
              console.log(arguments);
            },
            workspaceCreated: function (workspacePayload) {
                if (workspacePayload) {
                    this.workspacesCards.push(workspacePayload);
                }
            },
            sourceCreated: function (sourcePayload) {
                let workspace = this.workspaces.find(function (workspace) {
                  return sourcePayload.workspaceId == workspace.id;
                });

                workspace.sources.push(sourcePayload);
            },
            coreCreated: function (corePayload) {
              let workspace = this.workspaces.find(function (workspace) {
                return corePayload.workspaceId == workspace.id;
              });

              workspace.cores.push(corePayload);
            },
            sinkCreated: function (sinkPayload) {
              let workspace = this.workspaces.find(function (workspace) {
                return sinkPayload.workspaceId == workspace.id;
              });

              workspace.sinks.push(sinkPayload);
            },
            removeSource: function (sourceId) {
                this.removeWorkspaceSubject('sources', sourceId);
            },
            removeCore: function (coreId) {
                this.removeWorkspaceSubject('cores', coreId);
            },
            removeSink: function (sinkId) {
                this.removeWorkspaceSubject('sinks', sinkId);
            },
            removeWorkspaceSubject: function (subjectName, subjectId) {
              let me = this;
              let workspaceId = me.$refs['workspaceTabs'].activeTab;

              this.$http.delete('api/Workspaces/' + workspaceId + '/' + subjectName + '/' + subjectId).then(response => {
                if (response.ok) {
                  let workspaceSubjects = me.workspaces.find(function (workspace) {
                    return workspace.id == workspaceId;
                  })[subjectName];
                  let subjectToRemove = workspaceSubjects.find(function (subjectItem) {
                    return subjectItem.id == subjectId;
                  });
                  let indexToRemove = workspaceSubjects.indexOf(subjectToRemove);

                  if (indexToRemove !== -1) {
                    workspaceSubjects.splice(indexToRemove, 1);
                  }
                }
              }, err => {
                debugger;
              });
            },
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName'
            }),
            ...mapMutations({
                removeAccessToken: 'removeUserAccessToken',
                removeUserId: 'removeUserId'
            })
        },
        created: function () {
            this.updateWorkspacesList();
        }
    }
</script>

<style scoped>
  .main-page {
    width: 100%;
  }

  /*.workplace-left-panel {*/
    /*min-width: 275px;*/
    /*max-width: 275px;*/
    /*min-height: 500px;*/
  /*}*/

  .workspace-wrapper {
      width: 300px;
      margin: 5px;
      display: inline-block;
  }

  /*#workspace {*/
    /*width: auto;*/
    /*height: auto;*/
  /*}*/
</style>
