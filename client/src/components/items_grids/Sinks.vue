<template>
    <abstract-item-grid :columns="columns"
                        :items="sinksList">
    </abstract-item-grid>
</template>

<script>
    import AbstractItemGrid from './AbstractItemGrid.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'Sinks',
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
                    name: 'Type',
                    dataIndex: 'type'
                }, {
                    name: 'Connected',
                    dataIndex: 'connected'
                }],
                sinksList: []
            }
        },
        computed: {

        },
        methods: {
            loadData: function () {
                let me = this;

                me.$http.get('api/Sinks', {
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
                            me.sinksList = response.json();
                        } else {
                            throw 'Error while loading Sinks';
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
