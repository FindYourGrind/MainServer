<template>
    <abstract-item-grid :columns="columns"
                        :items="outputList">
    </abstract-item-grid>
</template>

<script>
    import AbstractItemGrid from './AbstractItemGrid.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'Output',
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
                outputList: []
            }
        },
        computed: {

        },
        methods: {
            loadData: function () {
                let me = this;

                me.$http.get('api/Outputs', {
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
                            me.outputList = response.json();
                        } else {
                            throw 'Error while loading Output';
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
