<template>
    <div :class="[outputData.connected ? 'connected' : 'disconnected', 'value-holder-root']">
        <md-layout md-align="center">
            <md-layout md-align="start">
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
                <md-button class="md-fab md-mini"
                           @click.native="edit">
                    <md-icon>edit</md-icon>
                </md-button>
            </md-layout>
            <md-layout md-align="end">
                Output: {{ outputData.name }}<br>
                ID: {{ outputData.id }}<br>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    export default {
        name: 'OutputComponent',
        props: ['workspaceData', 'outputData'],
        data: function () {
            return {}
        },
        methods: {
            edit: function () {

            },
            remove: function () {
                let me = this;
                let output = me.outputData;

                this.$http.delete('api/Cores/' + output.coreId + '/relatedOutputs/' + output.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', output.id);
                    }
                }, err => {
                    console.log(err);
                });
            }
        },
        created: function () {
            let me = this;

            me.$socket.on('output-' + me.outputData.id + '-update', function (data) {
                Object.keys(data).forEach(function (dataKey) {
                    me.outputData[dataKey] = data[dataKey];
                });
            });
        }
    }
</script>

<style scoped>
    .value-holder-root {
        width: 240px;
        height: 65px;
        margin: 5px;
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
