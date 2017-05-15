<template>
    <div class="core-root">
        <core-modal-form :workspaceData="workspaceData"
                         :coreData="coreData"
                         :editMode="true"
                         @edit="edit"
                         ref="coreModalForm"></core-modal-form>
        <input-modal-form :workspaceData="workspaceData"
                          :coreData="coreData"
                          @create="onInputCreate"
                          ref="inputModalForm"></input-modal-form>
        <output-modal-form :workspaceData="workspaceData"
                           :coreData="coreData"
                           @create="onOutputCreate"
                           ref="outputModalForm"></output-modal-form>


        <md-layout md-align="center">
            <md-layout md-align="center">
                {{ coreData.name }}
            </md-layout>
            <md-layout md-align="end">
                <md-button class="md-fab md-mini"
                           @click.native="$refs.coreModalForm.open()">
                    <md-icon>edit</md-icon>
                </md-button>
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
            </md-layout>
        </md-layout>

        <md-layout md-align="center">
            <md-layout md-align="start">
                <md-button class="md-fab md-mini"
                           @click.native="$refs.inputModalForm.open()">
                    <md-icon>add</md-icon>
                </md-button>
            </md-layout>
            <md-layout md-align="center">
                ID: {{ coreData.id }}
            </md-layout>
            <md-layout md-align="end">
                <md-button class="md-fab md-mini"
                           @click.native="$refs.outputModalForm.open()">
                    <md-icon>add</md-icon>
                </md-button>
            </md-layout>
        </md-layout>

        <md-layout>
            <md-layout md-align="start">
                <input-component v-for="input in coreData.relatedInputs"
                                 :key="input.id"
                                 :workspaceData="workspaceData"
                                 :coreData="coreData"
                                 :inputData="input"
                                 :ref="'input' + input.id"
                                 :id="'input' + input.id"
                                 @remove="onInputRemove"></input-component>
            </md-layout>
            <md-layout md-align="end">
                <output-component v-for="output in coreData.relatedOutputs"
                                  :key="output.id"
                                  :workspaceData="workspaceData"
                                  :coreData="coreData"
                                  :outputData="output"
                                  :ref="'output' + output.id"
                                  :id="'output' + output.id"
                                  @remove="onOutputRemove"></output-component>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import InputComponent from "./InputComponent.vue";
    import OutputComponent from "./OutputComponent.vue";
    import CoreModalForm from "./dialogs/CoreModalForm.vue";
    import InputModalForm from "./dialogs/InputModalForm.vue";
    import OutputModalForm from "./dialogs/OutputModalForm.vue";

    export default {
        name: 'Core',
        props: ['workspaceData', 'coreData'],
        components: {
            InputComponent,
            OutputComponent,
            CoreModalForm,
            InputModalForm,
            OutputModalForm
        },
        data: function () {
            return {}
        },
        computed: {},
        methods: {
            edit: function () {
                let me = this;

                me.$emit('edit', me.coreData);
            },
            remove: function () {
                let me = this;
                let core = me.coreData;

                this.$http.delete('api/Cores/' + core.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', core.id);
                    }
                }, err => {
                    debugger;
                });
            },
            onInputCreate: function (inputPayload) {
                let me = this;

                me.coreData.relatedInputs.push(inputPayload);
            },
            onOutputCreate: function (outputPayload) {
                let me = this;

                me.coreData.relatedOutputs.push(outputPayload);
            },
            onInputRemove: function (inputId) {
                let me = this;
                let relatedInputs = me.coreData.relatedInputs;
                let inputToRemove = relatedInputs.find(function (inputRecord) {
                    return inputRecord.id === inputId;
                });
                let indexToRemove = relatedInputs.indexOf(inputToRemove);

                if (indexToRemove > -1) {
                    relatedInputs.splice(indexToRemove, 1);
                }
            },
            onOutputRemove: function (outputId) {
                let me = this;
                let relatedOutputs = me.coreData.relatedOutputs;
                let outputToRemove = relatedOutputs.find(function (outputRecord) {
                    return outputRecord.id === outputId;
                });
                let indexToRemove = relatedOutputs.indexOf(outputToRemove);

                if (indexToRemove > -1) {
                    relatedOutputs.splice(indexToRemove, 1);
                }
            }
        },
        created: function () {
            let me = this;

            me.$socket.on('core-' + me.coreData.id + '-update', function (data) {
                Object.keys(data).forEach(function (dataKey) {
                    me.coreData[dataKey] = data[dataKey];
                });
            });
        }
    }
</script>

<style scoped>
  .core-root {
    width: 520px;
    margin: 5px 5px 5px 5px;
    padding: 0;
    background-color: rgba(29, 30, 31, 0.45);
    border-radius: 5px;
  }
</style>
