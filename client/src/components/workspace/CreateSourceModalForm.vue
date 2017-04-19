<template>
    <div>
        <md-button class="md-primary md-raised"
                   id="openCreateSourceModalFormButton"
                   @click.native="open">Create Source</md-button>

        <md-dialog md-open-from="#openCreateSourceModalFormButton"
                   ref="createSourceModalForm">
            <md-dialog-title>Create new Source</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Name</label>
                        <md-input required v-model.trim="sourceName"></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Type</label>
                        <md-input v-model.trim="sourceType"></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Connections</label>
                        <md-select multiple
                                   v-model="connection">
                            <md-subheader>{{ valueHolders.length > 0 ? "Inputs" : "No Available Inputs" }}</md-subheader>
                            <md-option v-for="valueHolder in valueHolders"
                                       :key="valueHolder.id"
                                       :value="valueHolder.id">{{ valueHolder.name }}</md-option>
                        </md-select>
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
        name: 'CreateSourceModalForm',
        props: ['workspace'],
        data: function () {
            return {
                sourceName: '',
                sourceType: '',
                connection: '',
                valueHolders: []
            }
        },
        methods: {
            open: function () {
                let me = this;

                this.$refs['createSourceModalForm'].open();
                this.$http.get('api/ValueHolders', {
                    params: {
                        filter: JSON.stringify({
                            where: { or: [ { workspaceId: 2 }, { coreId: {
                                            inq: me.workspace.cores.map(function (core) {
                                                return core.id;
                                            })}}], type: 1, connected: false }
                        })
                    }
                }).then(response => {
                    if (response.ok) {
                        me.valueHolders = response.data;
                    } else {
                        throw 'Error while loading available inputs';
                    }
                }).catch(err => {
                    debugger;
                });
            },
            save: function () {
                this.$http.post('api/Workspaces/' + this.workspace.id + '/sources', {
                    type: this.sourceType,
                    name: this.sourceName,
                    connection: this.connection,
                    connected: this.connection.length > 0
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
                this.$refs['createSourceModalForm'].close();
            },
            resetFormData: function () {
                this.sourceType = '';
                this.sourceName = '';
                this.connection = [];
            }
        }
    }
</script>

<style scoped>

</style>
