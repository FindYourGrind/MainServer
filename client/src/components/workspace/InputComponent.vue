<template>
    <div :class="[inputData.connected ? 'connected' : 'disconnected', 'value-holder-root']">
        <input-modal-form :workspaceData="workspaceData"
                          :coreData="coreData"
                          :inputData="inputData"
                          :editMode="true"
                          @edit="edit"
                          ref="inputModalForm"></input-modal-form>

        <md-layout md-align="center">
            <md-layout class="input-data" md-align="start">
                Input: {{ inputData.name }}<br>
                ID: {{ inputData.id }}<br>
                Value: {{ inputData.processedValue }}<br>
                Update Time: {{ (new Date(inputData.updateTimeStamp)).toLocaleTimeString() }}
            </md-layout>
            <md-layout md-align="end">
                <md-button class="md-fab md-mini"
                           @click.native="$refs.inputModalForm.open()">
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
    import InputModalForm from './dialogs/InputModalForm.vue';

    export default {
        name: 'InputComponent',
        components: {
            InputModalForm
        },
        props: {
            workspaceData: {
                type: Object,
                required: true
            },
            coreData: {
                type: Object,
                required: true
            },
            inputData: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {}
        },
        methods: {
            edit: function () {
                let me = this;

                me.$emit('edit', me.inputData);
            },
            remove: function () {
                let me = this;

                me.$http.delete('api/Inputs/' + me.inputData.id)
                    .then(response => {
                        if (response.ok) {
                            me.$emit('remove', me.inputData.id);
                        } else {
                            throw 'Error while removing Input';
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        //TODO error notification
                    });
            }
        },
        created: function () {
            let me = this;
            let eventList = [
                'input-' + me.inputData.id + '-create',
                'input-' + me.inputData.id + '-update'
            ];

            eventList.forEach(event => {
                me.$socket.on(event, data => {
                    Object.keys(data).forEach(dataKey => {
                        me.inputData[dataKey] = data[dataKey];
                    });
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

    .input-data {
        text-align: left;
        font-size: 9px;
    }
</style>
