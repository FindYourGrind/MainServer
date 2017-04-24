<template>
    <div class="core-root">
        <md-layout md-align="center">
            <md-layout md-align="center">
                {{ coreData.name }}
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

        <md-layout md-align="center">
            <md-layout md-align="start">
                <create-input-modal-form :workspaceId="coreData.workspaceId"
                                         :coreId="coreData.id"
                                         @create="onInputCreate"></create-input-modal-form>
            </md-layout>
            <md-layout md-align="center">
                ID: {{ coreData.id }}
            </md-layout>
            <md-layout md-align="end">
                <create-output-modal-form :workspaceId="coreData.workspaceId"
                                          :coreId="coreData.id"
                                          @create="onOutputCreate"></create-output-modal-form>
            </md-layout>
        </md-layout>

        <md-layout>
            <md-layout md-align="start" md-column>
                <input-component v-for="input in coreData.relatedInputs"
                                 :key="input.id"
                                 :workspaceData="workspaceData"
                                 :inputData="input"
                                 @remove="onInputRemove"></input-component>
            </md-layout>
            <md-layout md-align="end" md-column>
                <output-component v-for="output in coreData.relatedOutputs"
                                  :key="output.id"
                                  :workspaceData="workspaceData"
                                  :outputData="output"
                                  @remove="onOutputRemove"></output-component>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import InputComponent from "./InputComponent.vue";
    import OutputComponent from "./OutputComponent.vue";
    import CreateInputModalForm from "./CreateInputModalForm.vue";
    import CreateOutputModalForm from "./CreateOutputModalForm.vue";

    export default {
        name: 'Core',
        props: ['workspaceData', 'coreData'],
        components: {
            InputComponent,
            OutputComponent,
            CreateInputModalForm,
            CreateOutputModalForm
        },
        data: function () {
            return {}
        },
        computed: {},
        methods: {
            edit: function () {

            },
            remove: function () {
                let me = this;
                let core = me.coreData;

                this.$http.delete('api/Cores/' + core.id + '/completeRemoval').then(response => {
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
        }
    }
</script>

<style scoped>
  .core-root {
    width: 520px;
    margin: 15px 5px 15px 5px;
    padding: 5px;
    background-color: rgba(29, 30, 31, 0.45);
    border-radius: 5px;
  }
</style>
