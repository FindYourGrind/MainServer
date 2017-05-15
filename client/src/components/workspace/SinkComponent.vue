<template>
    <div class="sink-component-root">
        <sink-modal-form :workspaceData="workspaceData"
                         :sinkData="sinkData"
                         :editMode="true"
                         @edit="edit"
                         ref="sinkModalForm">
        </sink-modal-form>

        <div :class="[sinkData.connected ? 'connected' : 'disconnected', 'sink-root']">
            <md-layout class="sink-data" :md-row="true" md-align="center">
                <md-layout md-flex="true" md-align="start">
                    Input: {{ sinkData.name }}<br>
                    ID: {{ sinkData.id }}<br>
                </md-layout>
                <md-layout md-align="end">
                    <md-button class="md-fab md-mini"
                               @click.native="$refs.sinkModalForm.open()">
                        <md-icon>edit</md-icon>
                    </md-button>
                </md-layout>
                <md-layout md-align="end">
                    <md-button class="md-fab md-mini"
                               @click.native="remove">
                        <md-icon>delete</md-icon>
                    </md-button>
                </md-layout>
            </md-layout>
        </div>
    </div>
</template>

<script>
    import SinkModalForm from './dialogs/SinkModalForm.vue';

    export default {
        name: 'SinkComponent',
        props: ['workspaceData', 'sinkData'],
        components: {
            SinkModalForm
        },
        data: function () {
            return {}
        },
        computed: {

        },
        methods: {
            edit: function () {
                let me = this;

                me.$emit('edit', me.sinkData.id);
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

    .sink-data {
        float: left;
        text-align: left;
        font-size: 9px;
    }
</style>
