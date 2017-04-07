<template>
    <div class="sink-root">
        <md-layout md-align="center">
            <md-layout md-align="start">
                Input: {{ sinkData.name }}<br>
                ID: {{ sinkData.id }}<br>
            </md-layout>
            <md-layout md-align="end">
                <md-button class="md-fab md-mini"
                           @click.native="edit">
                    <md-icon>edit</md-icon>
                </md-button>
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>

    export default {
        name: 'SinkComponent',
        props: ['sinkData'],
        components: {

        },
        data: function () {
            return {}
        },
        computed: {

        },
        methods: {
            edit: function () {

            },
            remove: function () {
                let me = this;
                let sink = me.sinkData;

                this.$http.delete('api/Sinks/' + sink.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', sink.id);
                    }
                }, err => {
                    debugger;
                });
            },
        }
    }
</script>

<style scoped>
    .sink-root {
        width: 240px;
        height: 65px;
        margin: 15px 5px 15px 5px;
        padding: 5px;
        background-color: rgba(235, 147, 22, 0.45);
        border-radius: 5px;
    }
</style>
