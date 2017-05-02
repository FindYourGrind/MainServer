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
                        <label>Inputs Connections</label>
                        <md-select multiple
                                   v-model="inputIdList">
                            <md-subheader>{{ relatedInputs.length > 0 ? "Inputs" : "No Available Inputs" }}</md-subheader>
                            <md-option v-for="relatedInput in relatedInputs"
                                       :key="relatedInput.id"
                                       :value="relatedInput.id">{{ relatedInput.name }}</md-option>
                        </md-select>
                    </md-input-container>

                    <md-input-container>
                        <label>Source Type</label>
                        <md-select v-model.trim="sourceType" @change="onSourceTypeChange">
                            <md-option v-for="sourceWorkerType in sourceWorkerTypes"
                                       :key="sourceWorkerType.id"
                                       :value="sourceWorkerType.type">{{ sourceWorkerType.name }}</md-option>
                        </md-select>
                    </md-input-container>

                    <div v-if="selectedWorkerType">
                        {{ selectedWorkerType.name + " configuration:" }}
                        <md-input-container v-for="(field, index) in selectedWorkerType.configFields"
                                            :key="index" :ref="'worker-config-' + field.name">
                            <label> {{ field.displayName }}</label>
                            <md-input v-if="field.type === 'string'" v-model.trim="workerConfig[field.name]" type="text"></md-input>
                            <md-input v-else-if="field.type === 'number'" v-model.number="workerConfig[field.name]" type="number"></md-input>
                        </md-input-container>
                    </div>

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
                workerConfig: {},
                relatedInputs: [],
                sourceWorkerTypes: [],
                selectedWorkerType: null
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
                    me.workerConfig = me.sourceData.workerConfig;
                }

                me.$refs['createSourceModalForm'].open();

                me.$http.get('api/Inputs', {
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
                })
                    .then(response => {
                        if (response.ok) {
                            me.relatedInputs = response.json();
                            return me.$http.get('api/SourceWorkerTypes');
                        } else {
                            throw 'Error while loading available inputs';
                        }
                    })
                    .then(function (response) {
                        if (response.ok) {
                            me.sourceWorkerTypes = response.json();
                        }
                    })
                    .catch(err => {
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
                let me = this;
                let workerConfig = {};

                me.$http.post('api/Workspaces/' + me.workspaceData.id + '/relatedSources', {
                    type: me.sourceType,
                    name: me.sourceName,
                    inputIdList: me.inputIdArray,
                    workspaceId: me.workspaceData.id,
                    connected: me.inputIdArray.length > 0,
                    accountId: me.getUserId(),
                    workerConfig: me.workerConfig
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the source data');
                    }
                }, function () {
                    console.log('Error while saving the source data');
                }).then(function (sourcePayload) {
                    me.$emit('create', sourcePayload);
                }).then(me.close);
            },
            editSource: function () {
                let me = this;
                let workerConfig = {};

                me.$http.put('api/Sources/' + me.sourceData.id, {
                    type: me.sourceType,
                    name: me.sourceName,
                    inputIdList: me.inputIdArray,
                    workspaceId: me.workspaceData.id,
                    connected: me.inputIdArray.length > 0,
                    accountId: me.getUserId(),
                    workerConfig: me.workerConfig
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the source data');
                    }
                }, function () {
                    console.log('Error while saving the source data');
                }).then(function (sourcePayload) {
                    me.$emit('edit', sourcePayload);
                }).then(me.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createSourceModalForm'].close();
            },
            resetFormData: function () {
                let me = this;

                me.sourceType = '';
                me.sourceName = '';
                me.inputIdList = '';
                me.relatedInputs = [];
                me.workerConfig = {};
                me.sourceWorkerTypes = [];
                me.selectedWorkerType = null;

            },
            onSourceTypeChange: function (sourceType) {
                let me = this;

                me.selectedWorkerType = me.sourceWorkerTypes.find(item => item.type === sourceType);
            },
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName'
            })
        }
    }
</script>

<style scoped>

</style>
