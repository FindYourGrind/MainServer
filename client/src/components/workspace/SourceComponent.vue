<template>
    <div :class="[sourceData.connected ? 'connected' : 'disconnected', 'source-root']">
        <source-modal-form :workspaceData="workspaceData"
                           :sourceData="sourceData"
                           :editMode="true"
                           @edit="edit"
                           ref="sourceModalForm"></source-modal-form>

        <md-layout md-align="center">
            <md-layout md-align="start">
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
                <md-button class="md-fab md-mini"
                           @click.native="$refs.sourceModalForm.open()">
                    <md-icon>edit</md-icon>
                </md-button>
            </md-layout>
            <md-layout class="source-data" md-align="end">
                Name: {{ sourceData.name }}<br>
                ID: {{ sourceData.id }}<br>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import SourceModalForm from './dialogs/SourceModalForm.vue';

    export default {
        name: 'SourceComponent',
        components: {
            SourceModalForm
        },
        props: {
            workspaceData: {
                type: Object,
                required: true
            },
            sourceData: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {}
        },
        methods: {
            /**
             *
             */
            edit: function () {
                let me = this;

                me.$emit('edit', me.sourceData);
            },

            /**
             *
             */
            remove: function () {
                let me = this;

                me.$http.delete('api/Sources/' + me.sourceData.id)
                    .then(response => {
                        if (response.ok) {
                            me.$emit('remove', me.sourceData.id);
                        } else {
                            throw 'Error while removing Source';
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        //TODO add error notification
                    });
            },
        },
        created: function () {
            let me = this;
            let eventList = [
                'source-' + me.sourceData.id + '-update'
            ];

            eventList.forEach(event => {
                me.$socket.on(event, data => {
                    Object.keys(data).forEach(dataKey => {
                        me.sourceData[dataKey] = data[dataKey];
                    });
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
