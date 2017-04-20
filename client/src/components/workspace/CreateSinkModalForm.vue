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

                    <md-input-container>
                        <label>Output Connection</label>
                        <md-select v-model="outputId">
                            <md-subheader>{{ relatedOutputs.length > 0 ? "Outputs" : "No Available Outputs" }}</md-subheader>
                            <md-option v-for="relatedOutput in relatedOutputs"
                                       :key="relatedOutput.id"
                                       :value="relatedOutput.id">{{ relatedOutput.name }}</md-option>
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
        name: 'CreateSinkModalForm',
        props: ['workspaceData'],
        data: function () {
            return {
                sinkName: '',
                sinkType: '',
                outputId: '',
                relatedOutputs: []
            }
        },
        methods: {
            open: function () {
                let me = this;

                this.$refs['createSinkModalForm'].open();
                this.$http.get('api/Outputs', {
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
                        me.relatedOutputs = response.data;
                    } else {
                        throw 'Error while loading available outpus=ts';
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            save: function () {
                this.$http.post('api/Workspaces/' + this.workspaceData.id + '/relatedSinks', {
                    type: this.sinkType,
                    name: this.sinkName,
                    outputId: this.outputId
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
                this.outputId = '';
                this.relatedOutputs = [];
            }
        }
    }
</script>

<style scoped>

</style>
