<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="main-page">

        <md-button class="md-primary md-raised"
                   id="createWorkspaceButton"
                   @click.native="openDialog('createWorkspaceDialog')">Create Workspace</md-button>

        <md-dialog md-open-from="#createWorkspaceButton"
                   ref="createWorkspaceDialog">
            <md-dialog-title>Create new Workspace</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Name</label>
                        <md-input required v-model.trim="workspaceName"></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Description</label>
                        <md-textarea v-model.trim="workspaceDescription"></md-textarea>
                    </md-input-container>

                    <md-input-container @change.native="onWorkspaceImageChange">
                        <label>Description Image</label>
                        <md-file v-model="workspaceImage" @change.native="onWorkspaceImageChange"></md-file>
                    </md-input-container>
                </form>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeDialog('cancel', 'createWorkspaceDialog')">Cancel</md-button>
                <md-button class="md-primary" @click.native="closeDialog('save', 'createWorkspaceDialog')">Create</md-button>
            </md-dialog-actions>
        </md-dialog>

        <div>
            <div class="workspace-wrapper" v-for="workspace in workspaces" key="workspace.id">
                <md-card>
                    <!--<md-card-media>-->
                    <!--<img src="assets/card-image-1.jpg" alt="People">-->
                    <!--</md-card-media>-->

                    <md-card-header>
                        <h3>{{ workspace.name }}</h3>
                    </md-card-header>

                    <md-card-content>
                        {{ workspace.description }}
                    </md-card-content>

                    <md-card-actions>
                        <md-layout md-align="start" md-gutter="16">
                            <md-layout md-flex="25" md-flex-offset="2">
                                <md-button class="md-fab md-mini"
                                           @click.native="goToWorkspace(workspace.id)">
                                    <md-icon>apps</md-icon>
                                </md-button>
                            </md-layout>
                        </md-layout>

                        <md-button class="md-fab md-mini"
                                   @click.native="editWorkspace(workspace.id)">
                            <md-icon>edit</md-icon>
                        </md-button>
                        <md-button class="md-fab md-mini"
                                   @click.native="deleteWorkspace(workspace.id)">
                            <md-icon>delete</md-icon>
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'mainPage',
        data () {
            return {
                workspaceName: '',
                workspaceDescription: '',
                workspaceImage: null,
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
                this.$http.delete('api/Workspaces/' + id).then(response => {
                    this.updateWorkspacesList();
                }, err => {

                });
            },
            goToWorkspace: function (id) {

            },
            onWorkspaceImageChange: function (e) {
                let files = e.target.files || e.dataTransfer.files;
                debugger;
            },
            openDialog(ref) {
                this.$refs[ref].open();
            },
            closeDialog(action, ref) {
                if (action === 'save') {
                    this.$http.post('api/Workspaces', {
                        name: this.workspaceName,
                        description: this.workspaceDescription,
                        accountId: this.getUserId()
                    }).then(response => {
                        this.updateWorkspacesList();
                        this.workspaceName = '';
                        this.workspaceDescription = '';
                    }, err => {

                    });
                }

                this.$refs[ref].close();
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
