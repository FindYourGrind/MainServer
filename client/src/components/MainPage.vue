<template>
    <div class="main-page">
        <create-workspace-modal-form
                @create="workspaceCreated">
        </create-workspace-modal-form>

        <div>
            <div class="workspace-wrapper" v-for="workspace in workspaces" key="workspace.id">
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
    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapGetters, mapMutations } from 'vuex';
    import WorkspaceCard from './workspace/WorkspaceCard.vue';
    import CreateWorkspaceModalForm from './workspace/CreateWorkspaceModalForm.vue';

    export default {
        name: 'mainPage',
        components: {
            CreateWorkspaceModalForm,
            WorkspaceCard
        },
        data () {
            return {
                workspaces: [],
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
                        this.workspaces = response.json();
                    }
                }, err => {
                    debugger;
                });
            },
            editWorkspace: function (id) {
                console.log(id);
            },
            deleteWorkspace: function (id) {
                let removedWorkspaceIndex = this.workspaces.findIndex(function (workspace) {
                    return workspace.id === id;
                });

                if (removedWorkspaceIndex > -1) {
                    this.workspaces.splice(removedWorkspaceIndex, 1);
                }
            },
            goToWorkspace: function (id) {

            },
            workspaceCreated: function (workspacePayload) {
                if (workspacePayload) {
                    this.workspaces.push(workspacePayload);
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

    .workspace-wrapper {
        width: 300px;
        margin: 5px;
        display: inline-block;
    }
</style>
