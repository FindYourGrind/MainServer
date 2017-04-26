<template>
    <md-table-card class="input-table-root">
        <md-table md-sort="id">
            <md-table-header>
                <md-table-row>
                    <md-table-head class="input-table-header-cell" md-sort-by="id">ID</md-table-head>
                    <md-table-head class="input-table-header-cell" md-sort-by="name">Name</md-table-head>
                    <md-table-head class="input-table-header-cell" md-sort-by="type">Value Type</md-table-head>
                </md-table-row>
            </md-table-header>

            <md-table-body >
                <md-table-row v-for="input in inputList" :key="input.id">
                    <md-table-cell>{{ input.id }}</md-table-cell>
                    <md-table-cell>{{ input.name }}</md-table-cell>
                    <md-table-cell>{{ input.valueType }}</md-table-cell>

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
        name: 'Inputs',
        props: [],
        components: {

        },
        data: function () {
            return {
                inputList: []
            }
        },
        computed: {

        },
        methods: {
            loadData: function () {
                let me = this;

                me.$http.get('api/Inputs')
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
            }
        },
        created: function () {
            let me = this;

            me.loadData();
        }
    }
</script>

<style scoped>

    .input-table-root {
        margin: 10px;
        padding: 5px;
    }

    .actionPanel {
        width: 150px;
        float: right;
        padding-top: 4px;
    }

    .input-table-header-cell.md-table-head {
        position: relative;
        text-align: center;
    }

</style>
