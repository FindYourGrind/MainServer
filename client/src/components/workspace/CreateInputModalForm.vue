<template>
    <div>
        <md-button class="md-fab md-mini"
                   id="openCreateInputModalFormButton"
                   @click.native="open">
          <md-icon>add</md-icon>
        </md-button>

        <md-dialog md-open-from="#openCreateInputModalFormButton"
                   ref="createInputModalForm">
            <md-dialog-title>Create new Input</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Name</label>
                        <md-input required v-model.trim="inputName"></md-input>
                    </md-input-container>

                    <md-input-container>
                      <label>Value Type</label>
                      <md-input v-model.trim="inputValueType"></md-input>
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
        name: 'CreateInputModalForm',
        props: ['workspaceId', 'coreId'],
        data: function () {
            return {
                inputName: '',
                inputValueType: ''
            }
        },
        methods: {
            open: function () {
                this.$refs['createInputModalForm'].open();
            },
            save: function () {
                let me = this;
                let apiString = me.coreId ?
                  'api/Cores/' + me.coreId + '/relatedInputs' :
                  'api/Workspaces/' + me.workspaceId + '/relatedInputs';

                me.$http.post(apiString, {
                    name: me.inputName,
                    valueType: me.inputValueType,
                    workspaceId: me.workspaceId
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the Input data');
                    }
                }, function () {
                    console.log('Error while saving the Input data');
                }).then(function (inputPayload) {
                    me.$emit('create', inputPayload);
                }).then(me.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createInputModalForm'].close();
            },
            resetFormData: function () {
                this.inputName = '';
                this.inputValueType = '';
            }
        }
    }
</script>

<style scoped>

</style>
