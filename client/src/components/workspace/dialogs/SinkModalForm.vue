<template>
    <item-form-dialog-carcass :editMode="editMode"
                              subject="Sink"
                              :subjectData="sinkData"
                              @beforeOpen="beforeOpen"
                              @afterOpen="afterOpen"
                              @onSave="onSave"
                              @beforeClose="beforeClose"
                              ref="modalFormCarcass">
        <md-input-container>
            <label>Name</label>
            <md-input required v-model.trim="name"></md-input>
        </md-input-container>

        <md-input-container>
            <label>Type</label>
            <md-input v-model.trim="type"></md-input>
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
    </item-form-dialog-carcass>
</template>

<script>
    import ItemFormDialogCarcass from './ItemFormDialogCarcass.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'SinkModalForm',
        components: {
            ItemFormDialogCarcass
        },
        props: {
            workspaceData: {
                type: Object,
                required: true
            },
            sinkData: {
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
                name: '',
                type: '',
                outputId: '',
                relatedOutputs: []
            }
        },

        methods: {
            /**
             *
             */
            open() {
                let me = this;

                me.$refs['modalFormCarcass'].open();
            },

            /**
             *
             */
            beforeOpen() {
                let me = this;

                if (me.sinkData) {
                    me.name = me.sinkData.name;
                    me.type = me.sinkData.type;
                    me.outputId = me.sinkData.outputId;
                }
            },

            /**
             *
             */
            afterOpen() {
                let me = this;

                me.$http.get('api/Outputs', {
                    params: {
                        filter: JSON.stringify({
                            where: { or: [ { workspaceId: me.workspaceData.id }, { coreId: {
                                inq: me.workspaceData.relatedCores.map(function (core) {
                                    return core.id;
                                } ) } } ] }
                        })
                    }
                }).then(response => {
                    if (response.ok) {
                        me.relatedOutputs = response.json();
                    } else {
                        throw 'Error while loading available outputs';
                    }
                }).catch(err => {
                    console.log(err);
                    me.$refs['modalFormCarcass'].showDialogError(err);
                });
            },

            /**
             *
             */
            onSave: function () {
                let me = this;

                me.$http.put('api/Sinks/' + (me.editMode ? me.sinkData.id : ''), {
                    type: me.type,
                    name: me.name,
                    outputId: me.outputId,
                    workspaceId: me.workspaceData.id,
                    connected: me.outputId && me.outputId > 0,
                    accountId: me.getUserId()
                })
                    .then(response => {
                        if (response.ok) {
                            me.$emit(me.editMode === true ? 'edit' : 'create', response.json());
                            me.$refs['modalFormCarcass'].close();
                        } else {
                            throw 'Error while saving the sink data';
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        me.$refs['modalFormCarcass'].showDialogError(err);
                    });
            },

            /**
             *
             */
            beforeClose: function () {
                let me = this;

                me.type = '';
                me.name = '';
                me.outputId = '';
                me.relatedOutputs = [];
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
