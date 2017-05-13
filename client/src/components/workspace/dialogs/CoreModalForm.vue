<template>
    <div>
        <md-button class="md-primary md-raised"
                   id="openCreateCoreModalFormButton"
                   @click.native="open">Create Core</md-button>

        <md-dialog md-open-from="#openCreateCoreModalFormButton"
                   ref="createCoreModalForm"
                   @close="resetFormData">
            <md-dialog-title>Create new Core</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Name</label>
                        <md-input required v-model.trim="coreName"></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Type</label>
                        <md-input v-model.trim="coreType"></md-input>
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
    
    export default {
        name: 'CoreModalForm',
        props: ['workspaceId'],
        data: function () {
            return {
                coreName: '',
                coreType: ''
            }
        },
        methods: {
            open: function () {
                this.$refs['createCoreModalForm'].open();
            },
            save: function () {
                this.$http.post('api/Workspaces/' + this.workspaceId + '/relatedCores', {
                    name: this.coreName,
                    type: this.coreType,
                    accountId: this.getUserId()
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the workspace data');
                    }
                }, function () {
                    console.log('Error while saving the workspace data');
                }).then(function (sinkPayload) {
                    this.$emit('create', sinkPayload);
                }).then(this.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createCoreModalForm'].close();
            },
            resetFormData: function () {
                this.coreName = '';
                this.coreType = '';
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
