<template>
    <md-dialog md-open-from="#openCreateSourceModalFormButton"
               ref="createSourceModalForm">
        <md-dialog-title>{{ getDialogTitle() }}</md-dialog-title>

        <md-dialog-content class="dialog-content">
            <md-spinner v-if="showStartSpinner" class="spinner" md-indeterminate></md-spinner>
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
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'SourceModalForm',
        props: {
            workspaceData: {
                type: Object,
                required: true
            },
            sourceData: {
                type: Object,
                required: false
            },
            editMode: {
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
                selectedWorkerType: null,
                showStartSpinner: true
            }
        },

        computed: {
            inputIdArray: function () {
                let me = this;

                return me.inputIdList ? me.inputIdList : [];
            },
            relatedCoreIdList: function () {
                let me = this;

                return me.workspaceData.relatedCores ? me.workspaceData.relatedCores.map(core => core.id) : [];
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

                me.loadAssetData();
            },

            loadAssetData: function () {
                let me = this;
                let relatedCoreIdList = me.relatedCoreIdList;
                let whereCondition = {
                    where: { and: [
                        { or: [ { workspaceId: me.workspaceData.id },
                            { coreId: { inq: relatedCoreIdList } } ]
                        },
                        { or: [ { connected: false },
                            { sourceId: me.sourceData ? me.sourceData.id : 0 } ]
                        }
                    ]}
                };

                me.$http.get('api/Inputs', { params: { filter: JSON.stringify(whereCondition) } })
                    .then(function (response) {
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
                            me.showStartSpinner = false;
                        } else {
                            throw 'Error while loading available inputs';
                        }
                    })
                    .catch(function (err) {
                        console.log('Error while loading source asset data - ' + err);
                        me.showDialogError(err);
                    });
            },

            /**
             *
             */
            save: function () {
                let me = this;
                let url = 'api/Sources/' + (me.editMode ? me.sourceData.id : '');
                let eventName = me.editMode === true ? 'edit' : 'create';

                me.$http.put(url, {
                    name: me.sourceName,
                    type: me.sourceType,
                    connected: me.inputIdArray.length > 0,
                    inputIdList: me.inputIdArray,
                    workerConfig: me.workerConfig,
                    workspaceId: me.workspaceData.id,
                    accountId: me.getUserId()
                })
                    .then(function (response) {
                        if (response.ok) {
                            me.$emit(eventName, response.data);
                            me.close();
                            me.showStartSpinner = false;
                        } else {
                            throw 'Response not ok';
                        }
                    })
                    .catch(function (err) {
                        console.log('Error while saving the source data - ' + err);
                        me.showDialogError(err);
                    });
            },

            /**
             *
             */
            close: function () {
                let me = this;

                me.sourceType = '';
                me.sourceName = '';
                me.inputIdList = '';
                me.relatedInputs = [];
                me.workerConfig = {};
                me.sourceWorkerTypes = [];
                me.selectedWorkerType = null;

                me.$refs['createSourceModalForm'].close();
            },

            /**
             *
             * @param sourceType
             */
            onSourceTypeChange: function (sourceType) {
                let me = this;

                me.selectedWorkerType = me.sourceWorkerTypes.find(item => item.type === sourceType);
            },

            /**
             *
             * @param error
             */
            showDialogError: function (error) {
                me.showStartSpinner = false;
            },

            /**
             *
             */
            getDialogTitle: function () {
                let me = this;

                return me.editMode ?
                    "Edit Source: " + me.sourceData.name + "(" + me.sourceData.id + ")" :
                    "Create new Source";
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
    .spinner {
        position: absolute;
        left: 40%;
        top: 40%;
    }
</style>
