<template>
    <item-form-dialog-carcass :editMode="editMode"
                              subject="Source"
                              :subjectData="sourceData"
                              @beforeOpen="beforeOpen"
                              @afterOpen="afterOpen"
                              @onSave="onSave"
                              @beforeClose="beforeClose"
                              ref="modalFormCarcass">
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
    </item-form-dialog-carcass>
</template>

<script>
    import ItemFormDialogCarcass from './dialogs/ItemFormDialogCarcass.vue';
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
        components: {
            ItemFormDialogCarcass
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
            open() {
                let me = this;

                me.$refs['modalFormCarcass'].open();
            },

            beforeOpen() {
                let me = this;

                if (me.sourceData) {
                    me.sourceName = me.sourceData.name;
                    me.sourceType = me.sourceData.type;
                    me.inputIdList = me.sourceData.inputIdList;
                    me.workerConfig = me.sourceData.workerConfig;
                }
            },

            afterOpen() {
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
                        me.$refs['modalFormCarcass'].showDialogError(err);
                    });
            },

            /**
             *
             */
            onSave: function () {
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
                            me.$refs['modalFormCarcass'].close();
                            me.showStartSpinner = false;
                        } else {
                            throw 'Response not ok';
                        }
                    })
                    .catch(function (err) {
                        console.log('Error while saving the source data - ' + err);
                        me.$refs['modalFormCarcass'].showDialogError(err);
                    });
            },

            /**
             *
             */
            beforeClose: function () {
                let me = this;

                me.sourceType = '';
                me.sourceName = '';
                me.inputIdList = '';
                me.relatedInputs = [];
                me.workerConfig = {};
                me.sourceWorkerTypes = [];
                me.selectedWorkerType = null;
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
             */
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName'
            })
        }
    }
</script>

<style scoped>

</style>
