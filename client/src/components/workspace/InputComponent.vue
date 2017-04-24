<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div v-bind:class="[inputData.connected ? 'connected' : 'disconnected', 'value-holder-root']">
        <md-layout md-align="center">
            <md-layout md-align="start">
                Input: {{ inputData.name }}<br>
                ID: {{ inputData.id }}<br>
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
        name: 'InputComponent',
        props: ['inputData'],
        data: function () {
            return {}
        },
        methods: {
            edit: function () {

            },
            remove: function () {
                let me = this;
                let input = me.inputData;

                this.$http.delete('api/Cores/' + input.coreId + '/relatedInputs/' + input.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', input.id);
                    }
                }, err => {
                    console.log(err);
                });
            }
        },
        created: function () {
            let me = this;

            me.$socket.on('input-' + me.inputData.id + '-update', function (data) {
                Object.keys(data).forEach(function (dataKey) {
                    me.inputData[dataKey] = data[dataKey];
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
