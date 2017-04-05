<template>
    <div>
        <md-button class="md-primary md-raised"
                   id="openCreateSinkModalFormButton"
                   @click.native="open">Create Sink</md-button>

        <md-dialog md-open-from="#openCreateSinkModalFormButton"
                   ref="createSinkModalForm">
            <md-dialog-title>Create new Sink</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Name</label>
                        <md-input required v-model.trim="sinkName"></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Type</label>
                        <md-input v-model.trim="sinkType"></md-input>
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
    export default {
        name: 'CreateSinkModalForm',
        props: ['workspaceId'],
        data: function () {
            return {
                sinkName: '',
                sinkType: ''
            }
        },
        methods: {
            open: function () {
                this.$refs['createSinkModalForm'].open();
            },
            save: function () {
                this.$http.post('api/Workspaces/' + this.workspaceId + '/sinks', {
                    type: this.sinkType,
                    name: this.sinkName
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the source data');
                    }
                }, function () {
                    console.log('Error while saving the source data');
                }).then(function (sourcePayload) {
                    this.$emit('create', sourcePayload);
                }).then(this.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createSinkModalForm'].close();
            },
            resetFormData: function () {
                this.sinkType = '';
                this.sinkName = '';
            }
        }
    }
</script>

<style scoped>

</style>
