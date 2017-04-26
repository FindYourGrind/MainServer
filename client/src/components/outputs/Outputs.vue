<template>
    <md-table-card class="output-table-root">
        <md-table md-sort="id">
            <md-table-header>
                <md-table-row>
                    <md-table-head class="output-table-header-cell" md-sort-by="id">ID</md-table-head>
                    <md-table-head class="output-table-header-cell" md-sort-by="name">Name</md-table-head>
                    <md-table-head class="output-table-header-cell" md-sort-by="type">Value Type</md-table-head>
                </md-table-row>
            </md-table-header>

            <md-table-body >
                <md-table-row v-for="output in outputList" :key="output.id">
                    <md-table-cell>{{ output.id }}</md-table-cell>
                    <md-table-cell>{{ output.name }}</md-table-cell>
                    <md-table-cell>{{ output.valueType }}</md-table-cell>

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
        name: 'Output',
        props: [],
        components: {

        },
        data: function () {
            return {
                outputList: []
            }
        },
        computed: {

        },
        methods: {
            loadData: function () {
                let me = this;

                me.$http.get('api/Outputs')
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
            }
        },
        created: function () {
            let me = this;

            me.loadData();
        }
    }
</script>

<style scoped>

    .output-table-root {
        margin: 10px;
        padding: 5px;
    }

    .actionPanel {
        width: 150px;
        float: right;
        padding-top: 4px;
    }

    .output-table-header-cell.md-table-head {
        position: relative;
        text-align: center;
    }

</style>
