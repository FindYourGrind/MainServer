<template>
    <abstract-item-grid :columns="columns"
                        :items="coreList"
                        @select="onSelect">
    </abstract-item-grid>
</template>

<script>
    import AbstractItemGrid from './AbstractItemGrid.vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'Cores',
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
                }],
                coreList: []
            }
        },
        computed: {

        },
        methods: {

            /**
             *
             */
            onSelect(selectedItems) {
                console.log(selectedItems);
            },

            loadData: function () {
                let me = this;

                me.$http.get('api/Cores', {
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
                            me.coreList = response.json();
                        } else {
                            throw 'Error while loading Cores';
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
