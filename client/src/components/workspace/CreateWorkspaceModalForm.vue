<template>
    <div>
        <md-button class="md-primary md-raised"
                   id="openCreateWorkspaceModalFormButton"
                   @click.native="open">Create Workspace</md-button>

        <md-dialog md-open-from="#openCreateWorkspaceModalFormButton"
                   ref="createWorkspaceModalForm">
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

                    <md-input-container>
                        <label>Description Image</label>
                        <md-file v-model.trim="imageName" @selected="onImageSelected"></md-file>
                    </md-input-container>
                </form>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="close">Close</md-button>
                <md-button class="md-primary" @click.native="save">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    const PATH_TO_IMAGES = 'api/FileContainers/ImagesContainer/download/';

    export default {
        name: 'CreateWorkspaceModalForm',
        data: function () {
            return {
                workspaceName: '',
                workspaceDescription: '',
                imageName: '',
                workspaceImage: null
            }
        },
        methods: {
            onImageSelected: function (file) {
                this.workspaceImage = new FormData();
                this.workspaceImage.append('result', file);
            },
            open: function () {
                this.$refs['createWorkspaceModalForm'].open();
            },
            save: function () {
                let createPromise;

                if (this.workspaceImage && this.imageName) {
                    createPromise = this.saveWorkspaceImage().then(this.saveWorkspacePayload);
                } else {
                    createPromise = this.saveWorkspacePayload({
                        name: this.workspaceName,
                        description: this.workspaceDescription,
                        accountId: this.getUserId()
                    });
                }

                createPromise.then(function (workspacePayload) {
                    this.$emit('create', workspacePayload);
                }).then(this.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createWorkspaceModalForm'].close();
            },
            saveWorkspaceImage: function () {
                return this.$http.post('api/FileContainers/ImagesContainer/upload', this.workspaceImage, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then(function (response) {
                    if (response.ok) {
                        return {
                            name: this.workspaceName,
                            description: this.workspaceDescription,
                            descriptionImage: PATH_TO_IMAGES + this.imageName,
                            accountId: this.getUserId()
                        }
                    } else {
                        console.log('Error while uploading the workspace image');
                    }
                }, function () {
                    console.log('Error while uploading the workspace image');
                });
            },
            saveWorkspacePayload: function (payload) {
                return this.$http.post('api/Workspaces', payload).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the workspace data');
                    }
                }, function () {
                    console.log('Error while saving the workspace data');
                });
            },
            resetFormData: function () {
                this.workspaceName = '';
                this.workspaceDescription = '';
                this.workspaceImageName = '';
                this.workspaceImage = null;
            },
            ...mapGetters({
                getUserId: 'userId'
            })
        }
    }
</script>

<style scoped>

</style>
