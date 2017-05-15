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
            <md-input required v-model.trim="name"></md-input>
        </md-input-container>

        <md-input-container>
            <label>Description</label>
            <md-textarea v-model.trim="description"></md-textarea>
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
        components: {
            ItemFormDialogCarcass
        },
        props: {
            workspaceData: {
                type: Object
            },
            editMode: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                name: '',
                description: '',
                imageName: '',
                descriptionImage: null
            }
        },
        methods: {
            /**
             *
             */
            open() {
                let me = this;

                me.$refs['modalFormCarcass'].open();
            },

            /**
             *
             */
            beforeOpen() {
                let me = this;

                if (me.workspaceData) {
                    me.name = me.workspaceData.name;
                    me.description = me.workspaceData.description;
                    me.descriptionImage = me.workspaceData.descriptionImage;
                }
            },

            /**
             *
             */
            onSave: function () {
                let me = this;

                (me.descriptionImage && me.imageName ?
                    me.saveWorkspaceImage()
                        .then(me.saveWorkspacePayload) :
                    me.saveWorkspacePayload({
                        name: me.name,
                        description: me.description,
                        accountId: me.getUserId()
                    }))
                    .then(workspacePayload => {
                        me.$emit(me.editMode === true ? 'edit' : 'create', workspacePayload);
                        me.$refs['modalFormCarcass'].close();
                    })
                    .catch(err => {
                        console.log(err);
                        me.$refs['modalFormCarcass'].showDialogError(err);
                    });
            },

            /**
             *
             */
            beforeClose: function () {
                let me = this;

                me.name = '';
                me.description = '';
                me.workspaceImageName = '';
                me.descriptionImage = null;
            },

            /**
             *
             */
            saveWorkspaceImage: function () {
                let me = this;

                return me.$http.post('api/FileContainers/ImagesContainer/upload', me.descriptionImage, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            return {
                                name: me.name,
                                description: me.description,
                                descriptionImage: PATH_TO_IMAGES + me.imageName,
                                accountId: me.getUserId()
                            }
                        } else {
                            throw 'Error while uploading the workspace image';
                        }
                    });
            },

            /**
             *
             */
            saveWorkspacePayload: function (payload) {
                let me = this;

                return me.$http.put('api/Workspaces/' + (me.editMode ? me.workspaceData.id : ''), payload)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw 'Error while saving the workspace data';
                        }
                    });
            },

            /**
             *
             */
            onImageSelected: function (file) {
                let me = this;

                me.descriptionImage = new FormData();
                me.descriptionImage.append('result', file);
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


