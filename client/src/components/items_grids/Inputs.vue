<template>
    <abstract-item-grid :columns="columns"
                        :items="inputList">
    </abstract-item-grid>
</template>

<script>
    import AbstractItemGrid from './AbstractItemGrid.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'Inputs',
        props: [],
        components: {
            AbstractItemGrid
        },
        data: function () {
            return {
                columns: [{
                    name: 'ID',
                    dataIndex: 'id'
                }, {
                    name: 'Name',
                    dataIndex: 'name'
                }, {
                    name: 'Value Type',
                    dataIndex: 'valueType'
                }, {
                    name: 'Connected',
                    dataIndex: 'connected'
                }],
                inputList: []
            }
        },
        computed: {

        },
        methods: {
            loadData: function () {
                let me = this;

                me.$http.get('api/Inputs', {
                    params: {
                        filter: {
                            where: {
                                accountId: this.getUserId()
                            }
                        }
                    }
                })
                    .then(function (response) {
                        if (response.ok === true) {
                            me.inputList = response.json();
                        } else {
                            throw 'Error while loading Inputs';
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },

            /**
             *
             */
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName'
            })
        },
        created: function () {
            let me = this;

            me.loadData();
        }
    }
</script>

<style scoped>

</style>
