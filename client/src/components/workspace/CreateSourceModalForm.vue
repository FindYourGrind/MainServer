<template>
    <div>
        <md-button :class="openButtonCls"
                   id="openCreateSourceModalFormButton"
                   @click.native="open">{{ showOpenButtonIcon ? "" : (sourceData ? "Edit Source" : "Create Source") }}
            <md-icon v-if="showOpenButtonIcon">edit</md-icon>
        </md-button>

        <md-dialog md-open-from="#openCreateSourceModalFormButton"
                   ref="createSourceModalForm">
            <md-dialog-title>{{ sourceData ? "Edit Source: " + sourceData.name + "(" + sourceData.id + ")" : "Create new Source"}}</md-dialog-title>

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
        props: {
            workspaceData: {
                type: Object,
                required: true
            },
            sourceData: {
                type: Object,
                required: false
            },
            openButtonCls: {
                type: String,
                default: 'md-primary md-raised'
            },
            showOpenButtonIcon: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                sourceName: '',
                sourceType: '',
                inputIdList: '',
                relatedInputs: []
            }
        },
        computed: {
            inputIdArray: function () {
                return this.inputIdList ? this.inputIdList : [];
            }
        },
        methods: {
            open: function () {
                let me = this;

                if (me.sourceData) {
                    me.sourceName = me.sourceData.name;
                    me.sourceType = me.sourceData.type;
                    me.inputIdList = me.sourceData.inputIdList;
                }

                this.$refs['createSourceModalForm'].open();
                this.$http.get('api/Inputs', {
                    params: {
                        filter: JSON.stringify({
                            where: { and: [
                                { or: [ { workspaceId: me.workspaceData.id },
                                    { coreId: { inq: me.workspaceData.relatedCores.map(function (core) { return core.id; } ) } } ]
                                },
                                { or: [ { connected: false },
                                    { sourceId: me.sourceData ? me.sourceData.id : 0 } ]
                                }
                            ]}
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
                let me = this;

                if (me.sourceData) {
                    me.editSource();
                } else {
                    me.createSource();
                }
            },
            createSource: function () {
                this.$http.post('api/Workspaces/' + this.workspaceData.id + '/relatedSources', {
                    type: this.sourceType,
                    name: this.sourceName,
                    inputIdList: this.inputIdArray,
                    workspaceId: this.workspaceData.id,
                    connected: this.inputIdArray.length > 0
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
            editSource: function () {
                let me = this;

                me.$http.put('api/Sources/' + me.sourceData.id, {
                    type: this.sourceType,
                    name: this.sourceName,
                    inputIdList: this.inputIdArray,
                    workspaceId: this.workspaceData.id,
                    connected: this.inputIdArray.length > 0
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the source data');
                    }
                }, function () {
                    console.log('Error while saving the source data');
                }).then(function (sourcePayload) {
                    this.$emit('edit', sourcePayload);
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
