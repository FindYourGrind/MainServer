<template>
    <md-table-card class="core-table-root">
        <md-table md-sort="id">
            <md-table-header>
                <md-table-row>
                    <md-table-head class="core-table-header-cell" md-sort-by="id">ID</md-table-head>
                    <md-table-head class="core-table-header-cell" md-sort-by="name">Name</md-table-head>
                    <md-table-head class="core-table-header-cell" md-sort-by="type">Type</md-table-head>
                </md-table-row>
            </md-table-header>

            <md-table-body >
                <md-table-row v-for="core in coreList" :key="core.id">
                    <md-table-cell>{{ core.id }}</md-table-cell>
                    <md-table-cell>{{ core.name }}</md-table-cell>
                    <md-table-cell>{{ core.type }}</md-table-cell>

                    <div class="actionPanel">
                        <md-button class="md-icon-button">
                            <md-icon>edit</md-icon>
                        </md-button>

                        <md-button class="md-icon-button">
                            <md-icon>delete</md-icon>
                        </md-button>

                    </div>

                </md-table-row>
            </md-table-body>
        </md-table>
    </md-table-card>
</template>

<script>
    export default {
        name: 'Cores',
        props: [],
        components: {

        },
        data: function () {
            return {
                coreList: []
            }
        },
        computed: {

        },
        methods: {
            loadData: function () {
                let me = this;

                me.$http.get('api/Cores')
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
            }
        },
        created: function () {
            let me = this;

            me.loadData();
        }
    }
</script>

<style scoped>

    .core-table-root {
        margin: 10px;
        padding: 5px;
    }

    .actionPanel {
        width: 150px;
        float: right;
        padding-top: 4px;
    }

    .core-table-header-cell.md-table-head {
        position: relative;
        text-align: center;
    }

</style>
