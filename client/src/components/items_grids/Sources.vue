<template>
    <abstract-item-grid :columns="columns"
                        :items="sourcesList">
    </abstract-item-grid>
</template>

<script>
    import AbstractItemGrid from './AbstractItemGrid.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'Sources',
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
                sourcesList: []
            }
        },
        computed: {

        },
        methods: {
            loadData: function () {
                let me = this;

                me.$http.get('api/Sources', {
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
                            me.sourcesList = response.json();
                        } else {
                            throw 'Error while loading Sources';
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
