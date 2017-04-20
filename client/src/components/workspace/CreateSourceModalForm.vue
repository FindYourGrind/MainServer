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
                        <label>Inputs Connections</label>
                        <md-select multiple
                                   v-model="inputIdList">
                            <md-subheader>{{ relatedInputs.length > 0 ? "Inputs" : "No Available Inputs" }}</md-subheader>
                            <md-option v-for="relatedInput in relatedInputs"
                                       :key="relatedInput.id"
                                       :value="relatedInput.id">{{ relatedInput.name }}</md-option>
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
        props: ['workspaceData'],
        data: function () {
            return {
                sourceName: '',
                sourceType: '',
                inputIdList: '',
                relatedInputs: []
            }
        },
        methods: {
            open: function () {
                let me = this;

                this.$refs['createSourceModalForm'].open();
                this.$http.get('api/Inputs', {
                    params: {
                        filter: JSON.stringify({
                            where: { or: [ { workspaceId: me.workspaceData.id }, { coreId: {
                                            inq: me.workspaceData.relatedCores.map(function (core) {
                                                return core.id;
                                            })}}], connected: false }
                        })
                    }
                }).then(response => {
                    if (response.ok) {
                        me.relatedInputs = response.data;
                    } else {
                        throw 'Error while loading available inputs';
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            save: function () {
                this.$http.post('api/Workspaces/' + this.workspaceData.id + '/relatedSources', {
                    type: this.sourceType,
                    name: this.sourceName,
                    inputIdList: this.inputIdList
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
                this.inputIdList = '';
                this.relatedInputs = [];
            }
        }
    }
</script>

<style scoped>

</style>
