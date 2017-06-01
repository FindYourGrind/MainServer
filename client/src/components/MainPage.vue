<template>
    <div class="main-page">
        <workspace-modal-form @create="workspaceCreated"
                              ref="workspaceModalForm"></workspace-modal-form>

        <md-tabs class="md-transparent"
                 md-elevation="1"
                 ref="mainTabs"
                 @change="onMainTabChanged">
            <md-tab id="workspaces" md-label="Workspaces">
                <md-button @click.native="$refs.workspaceModalForm.open()">Create Workspace</md-button>

                <div>
                    <div class="workspace-wrapper" v-for="workspace in workspacesCards" :key="workspace.id">
                        <workspace-card :workspaceData="workspace"
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
                    <md-tab v-for="workspace in workspaces" :key="workspace.id" :id="workspace.id"
                            :md-label="workspace.name">
                        <workspace-editor :workspace="workspace"></workspace-editor>
                    </md-tab>
                </md-tabs>
            </md-tab>

            <md-tab id="cores" md-label="Cores">
                <cores ref="coresTable"></cores>
            </md-tab>

            <md-tab id="sources" md-label="Sources">
                <sources ref="sourcesTable"></sources>
            </md-tab>

            <md-tab id="inputs" md-label="Inputs">
                <inputs ref="inputsTable"></inputs>
            </md-tab>

            <md-tab id="outputs" md-label="Outputs">
                <outputs ref="outputsTable"></outputs>
            </md-tab>

            <md-tab id="sinks" md-label="Sinks">
                <sinks ref="sinksTable"></sinks>
            </md-tab>

        </md-tabs>
    </div>
</template>

<script>
    import Vue from 'vue';
    import WorkspaceCard from './workspace/WorkspaceCard.vue';
    import WorkspaceModalForm from './workspace/dialogs/WorkspaceModalForm.vue';
    import WorkspaceEditor from './workspace/WorkspaceEditor.vue';
    import Cores from './items_grids/Cores.vue';
    import Inputs from './items_grids/Inputs.vue';
    import Outputs from './items_grids/Outputs.vue';
    import Sinks from './items_grids/Sinks.vue';
    import Sources from './items_grids/Sources.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'mainPage',
        components: {
            WorkspaceModalForm,
            WorkspaceCard,
            WorkspaceEditor,
            Cores,
            Inputs,
            Outputs,
            Sinks,
            Sources
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
                let me = this;

                me.updateWorkspacesList();
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
                                    filter: '{"include": [{"relatedCores":["relatedInputs", "relatedOutputs"]}, "relatedSources", "relatedSinks"]}'
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
                        me.$refs['coresTable'].loadData();
                        break;
                    case 3:
                        me.$refs['sourcesTable'].loadData();
                        break;
                    case 4:
                        me.$refs['inputsTable'].loadData();
                        break;
                    case 5:
                        me.$refs['outputsTable'].loadData();
                        break;
                    case 6:
                        me.$refs['sinksTable'].loadData();
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
