<template>
    <item-form-dialog-carcass :editMode="editMode"
                              subject="Workspace"
                              :subjectData="workspaceData"
                              @beforeOpen="beforeOpen"
                              @onSave="onSave"
                              @beforeClose="beforeClose"
                              ref="modalFormCarcass">
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
    </item-form-dialog-carcass>
</template>

<script>
    import ItemFormDialogCarcass from './ItemFormDialogCarcass.vue';
    import { mapGetters, mapMutations } from 'vuex';

    const PATH_TO_IMAGES = 'api/FileContainers/ImagesContainer/download/';

    export default {
        name: 'WorkspaceModalForm',
        props: {
            workspaceData: {
                type: Object
            },
            editMode: {
                type: Boolean,
                default: false
            }
        },
        components: {
            ItemFormDialogCarcass
        },
        data: function () {
            return {
                workspaceName: '',
                workspaceDescription: '',
                imageName: '',
                workspaceImage: null
            }
        },
        methods: {
            open() {
                let me = this;

                me.$refs['modalFormCarcass'].open();
            },

            beforeOpen() {
                let me = this;

                if (me.workspaceData) {
                    me.workspaceName = me.workspaceData.name;
                    me.workspaceDescription = me.workspaceData.description;
                    me.workspaceImage = me.workspaceData.descriptionImage;
                }
            },

            /**
             *
             */
            onSave: function () {
                let me = this;
                let createPromise;
                let eventName = me.editMode === true ? 'edit' : 'create';

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
                    this.$emit(eventName, workspacePayload);
                }).then(me.$refs['modalFormCarcass'].close());
            },

            /**
             *
             */
            beforeClose: function () {
                let me = this;

                me.workspaceName = '';
                me.workspaceDescription = '';
                me.workspaceImageName = '';
                me.workspaceImage = null;
            },

            /**
             *
             */
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

            /**
             *
             */
            saveWorkspacePayload: function (payload) {
                let me = this;
                let url = 'api/Workspaces/' + (me.editMode ? me.workspaceData.id : '');

                return this.$http.put(url, payload).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the workspace data');
                    }
                }, function () {
                    console.log('Error while saving the workspace data');
                });
            },

            /**
             *
             */
            onImageSelected: function (file) {
                this.workspaceImage = new FormData();
                this.workspaceImage.append('result', file);
            },

            /**
             *
             */
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName'
            })
        }
    }
</script>

<style scoped>

</style>


