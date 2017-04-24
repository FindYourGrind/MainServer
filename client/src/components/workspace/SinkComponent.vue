<template>
    <div :class="[sinkData.connected ? 'connected' : 'disconnected', 'sink-root']">
        <md-layout md-align="center">
            <md-layout md-align="start">
                Input: {{ sinkData.name }}<br>
                ID: {{ sinkData.id }}<br>
            </md-layout>
            <md-layout md-align="end">
                <create-sink-modal-form :workspaceData="workspaceData"
                                        :sinkData="sinkData"
                                        openButtonCls="md-fab md-mini"
                                        :showOpenButtonIcon="true"
                                        @edit="edit">
                </create-sink-modal-form>
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import CreateSinkModalForm from './CreateSinkModalForm.vue';

    export default {
        name: 'SinkComponent',
        props: ['workspaceData', 'sinkData'],
        components: {
            CreateSinkModalForm
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
        },
        created: function () {
            let me = this;

            me.$socket.on('sink-' + me.sinkData.id + '-update', function (data) {
                Object.keys(data).forEach(function (dataKey) {
                    me.sinkData[dataKey] = data[dataKey];
                });
            });
        }
    }
</script>

<style scoped>
    .sink-root {
        width: 240px;
        height: 65px;
        margin: 15px 5px 15px 5px;
        padding: 5px;
        border-radius: 5px;
    }

    .disconnected {
        background-color: rgba(235, 147, 22, 0.45);
    }

    .connected {
        background-color: rgba(11, 235, 0, 0.45);
    }
</style>
