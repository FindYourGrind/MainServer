<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div v-bind:class="[sourceData.connected ? 'connected' : 'disconnected', 'source-root']">
        <md-layout md-align="center">
            <md-layout md-align="start">
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
                <create-source-modal-form :workspaceData="workspaceData"
                                          :sourceData="sourceData"
                                          openButtonCls="md-fab md-mini"
                                          :showOpenButtonIcon="true"
                                          @edit="edit">
                </create-source-modal-form>
            </md-layout>
            <md-layout class="source-data" md-align="end">
                Input: {{ sourceData.name }}<br>
                ID: {{ sourceData.id }}<br>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import CreateSourceModalForm from './CreateSourceModalForm.vue';

    export default {
        name: 'SourceComponent',
        props: ['workspaceData', 'sourceData'],
        components: {
            CreateSourceModalForm
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
                let source = me.sourceData;

                this.$http.delete('api/Sources/' + source.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', source.id);
                    }
                }, err => {
                    console.log(err);
                });
            },
        },
        created: function () {
            let me = this;

            me.$socket.on('source-' + me.sourceData.id + '-update', function (data) {
                Object.keys(data).forEach(function (dataKey) {
                    me.sourceData[dataKey] = data[dataKey];
                });
            });
        }
    }
</script>

<style scoped>
    .source-root {
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

    .source-data {
        float: left;
        text-align: left;
        font-size: 9px;
    }
</style>
