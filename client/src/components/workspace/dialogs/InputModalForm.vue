<template>
    <item-form-dialog-carcass :editMode="editMode"
                              subject="Input"
                              :subjectData="inputData"
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
            <label>Value Type</label>
            <md-input v-model.trim="valueType"></md-input>
        </md-input-container>

    </item-form-dialog-carcass>
</template>

<script>
    import ItemFormDialogCarcass from './ItemFormDialogCarcass.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'InputModalForm',
        components: {
            ItemFormDialogCarcass
        },
        props: {
            workspaceData: {
                type: Object,
                required: true
            },
            coreData: {
                type: Object,
                required: true
            },
            inputData: {
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
                valueType: ''
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

                if (me.inputData) {
                    me.name = me.inputData.name;
                    me.valueType = me.inputData.valueType;
                }
            },

            /**
             *
             */
            afterOpen() {

            },

            /**
             *
             */
            onSave: function () {
                let me = this;

                me.$http.put('api/Inputs/' + (me.editMode ? me.inputData.id : ''), {
                    name: me.name,
                    valueType: me.valueType,
                    workspaceId: me.workspaceData.id,
                    coreId: me.coreData.id,
                    accountId: me.getUserId()
                })
                    .then(response => {
                        if (response.ok) {
                            me.$emit(me.editMode === true ? 'edit' : 'create', response.json());
                            me.$refs['modalFormCarcass'].close();
                        } else {
                            throw 'Input response not ok';
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

                me.name = '';
                me.valueType = '';
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
