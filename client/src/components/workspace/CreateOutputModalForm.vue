<template>
    <div>
        <md-button class="md-fab md-mini"
                   id="openCreateOutputModalFormButton"
                   @click.native="open">
            <md-icon>add</md-icon>
        </md-button>

        <md-dialog md-open-from="#openCreateOutputModalFormButton"
                   ref="createOutputModalForm">
            <md-dialog-title>Create new Output</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Name</label>
                        <md-input required v-model.trim="outputName"></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Value Type</label>
                        <md-input v-model.trim="outputValueType"></md-input>
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
        name: 'CreateOutputModalForm',
        props: ['workspaceId', 'coreId'],
        data: function () {
            return {
                outputName: '',
                outputValueType: ''
            }
        },
        methods: {
            open: function () {
                this.$refs['createOutputModalForm'].open();
            },
            save: function () {
                let me = this;
                let apiString = me.coreId ?
                    'api/Cores/' + me.coreId + '/relatedOutputs' :
                    'api/Workspaces/' + me.workspaceId + '/relatedOutputs';

                me.$http.post(apiString, {
                    name: me.outputName,
                    valueType: me.outputValueType,
                    workspaceId: me.workspaceId
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the Output data');
                    }
                }, function () {
                    console.log('Error while saving the Output data');
                }).then(function (outputPayload) {
                    me.$emit('create', outputPayload);
                }).then(me.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createOutputModalForm'].close();
            },
            resetFormData: function () {
                this.outputName = '';
                this.outputValueType = '';
            }
        }
    }
</script>

<style scoped>

</style>
