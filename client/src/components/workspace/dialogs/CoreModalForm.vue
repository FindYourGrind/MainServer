<template>
    <item-form-dialog-carcass :editMode="editMode"
                              subject="Core"
                              :subjectData="coreData"
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
    </item-form-dialog-carcass>
</template>

<script>
    import ItemFormDialogCarcass from './ItemFormDialogCarcass.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'CoreModalForm',
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
                type: ''
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

                if (me.coreData) {
                    me.name = me.coreData.name;
                    me.type = me.coreData.type;
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

                me.$http.put('api/Cores/' + (me.editMode ? me.coreData.id : ''), {
                    name: me.name,
                    type: me.type,
                    workspaceId: me.workspaceData.id,
                    accountId: me.getUserId()
                })
                    .then(response => {
                        if (response.ok) {
                            me.$emit(me.editMode === true ? 'edit' : 'create', response.json());
                            me.$refs['modalFormCarcass'].close();
                        } else {
                            throw 'Error while saving the workspace data';
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
                me.type = '';
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
