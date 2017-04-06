<template>
    <div>
        <md-button class="md-fab md-mini"
                   id="openCreateValueHolderModalFormButton"
                   @click.native="open">
          <md-icon>add</md-icon>
        </md-button>

        <md-dialog md-open-from="#openCreateValueHolderModalFormButton"
                   ref="createValueHolderModalForm">
            <md-dialog-title>Create new {{ valueHolderType === 1 ? "Input" : "Output" }}</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Name</label>
                        <md-input required v-model.trim="valueHolderName"></md-input>
                    </md-input-container>

                    <md-input-container>
                      <label>Value Type</label>
                      <md-input v-model.trim="valueHolderValueType"></md-input>
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
        name: 'CreateValueHolderModalForm',
        props: ['workspaceId', 'coreId', 'valueHolderType'],
        data: function () {
            return {
                valueHolderName: '',
                valueHolderValueType: ''
            }
        },
        methods: {
            open: function () {
                this.$refs['createValueHolderModalForm'].open();
            },
            save: function () {
                let me = this;
                let apiString = me.coreId ?
                  'api/Cores/' + me.coreId + '/valueHolders' :
                  'api/Workspaces/' + me.workspaceId + '/valueHolders';

                me.$http.post(apiString, {
                    name: me.valueHolderName,
                    type: me.valueHolderType,
                    valueType: me.valueHolderValueType
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the valueHolder data');
                    }
                }, function () {
                    console.log('Error while saving the valueHolder data');
                }).then(function (valueHolderPayload) {
                    me.$emit('create', valueHolderPayload);
                }).then(me.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createValueHolderModalForm'].close();
            },
            resetFormData: function () {
                this.valueHolderName = '';
                this.valueHolderValueType = '';
            }
        }
    }
</script>

<style scoped>

</style>
