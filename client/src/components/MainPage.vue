<template>
  <div class="main-page">
    <md-tabs class="md-transparent"
             md-elevation="1"
             ref="mainTabs"
             @change="onTabChanged">
      <md-tab id="workspaces" md-label="Workspaces">
        <create-workspace-modal-form @create="workspaceCreated"></create-workspace-modal-form>

        <div>
          <div class="workspace-wrapper" v-for="workspace in workspacesCards" key="workspace.id">
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
        <!--<md-layout md-gutter="8">-->
          <!--<md-layout md-flex="20">-->
            <!--<span>-->
              <!--<md-whiteframe class="workplace-left-panel" md-elevation="3">-->
                <!--<div class="workplace-left-panel">-->
                  <!--<create-core-modal-form @create="coreCreated"></create-core-modal-form>-->
                <!--</div>-->
              <!--</md-whiteframe>-->
            <!--</span>-->
          <!--</md-layout>-->

          <!--<md-layout md-flex="8">-->
            <!--<span>-->
              <!--<md-whiteframe md-elevation="3">-->
                <!--<div v-for="workspace in workspaces" key="workspace.id">-->
                  <!--{{ JSON.stringify(workspace) }}-->
                <!--</div>-->
              <!--</md-whiteframe>-->
            <!--</span>-->
          <!--</md-layout>-->
        <!--</md-layout>-->

        <md-tabs md-fixed ref="workspaceTabs">
          <md-tab v-for="workspace in workspaces" :key="workspace.id" :md-label="workspace.name">
            <p>
            {{ workspace.name }}
            </p>
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

    export default {
        name: 'mainPage',
        components: {
            CreateWorkspaceModalForm,
            CreateCoreModalForm,
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
            onTabChanged: function (tabIndex) {
                let me = this;
              switch (tabIndex) {
                case 0:

                  break;
                case 1:
                  if (this.workspaceIdToOpen) {
                    this.$http.get('api/Workspaces/' + me.workspaceIdToOpen, {
                        params: {
                            filter: {
                              include: ["cores", "sources", "sinks"]
                            }
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
            workspaceCreated: function (workspacePayload) {
                if (workspacePayload) {
                    this.workspacesCards.push(workspacePayload);
                }
            },
            coreCreated: function (corePayload) {

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
