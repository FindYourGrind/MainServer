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
                <create-value-holder-modal-form :workspaceId="coreData.workspaceId"
                                                :coreId="coreData.id"
                                                :valueHolderType="1"
                                                @create="onValueHolderCreate"></create-value-holder-modal-form>
            </md-layout>
            <md-layout md-align="center">
                ID: {{ coreData.id }}
            </md-layout>
            <md-layout md-align="end">
                <create-value-holder-modal-form :workspaceId="coreData.workspaceId"
                                                :coreId="coreData.id"
                                                :valueHolderType="2"
                                                @create="onValueHolderCreate"></create-value-holder-modal-form>
            </md-layout>
        </md-layout>

        <md-layout>
            <md-layout md-align="start" md-column>
                <value-holder v-for="input in inputs"
                              :key="input.id"
                              :valueHolderData="input"
                              @remove="onValueHolderRemove"></value-holder>
            </md-layout>
            <md-layout md-align="end" md-column>
                <value-holder v-for="output in outputs"
                              :key="output.id"
                              :valueHolderData="output"
                              :leftToRight="true"
                              @remove="onValueHolderRemove"></value-holder>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import ValueHolder from "./ValueHolder.vue";
    import CreateValueHolderModalForm from "./CreateValueHolderModalForm.vue";

    const INPUT_TYPE = 1;
    const OUTPUT_TYPE = 2;

    export default {
        name: 'Core',
        props: ['coreData'],
        components: {
            ValueHolder,
            CreateValueHolderModalForm
        },
        data: function () {
            return {}
        },
        computed: {
            inputs: function () {
                return this.coreData.valueHolders.filter(function (valueHolder) {
                    return valueHolder.type === INPUT_TYPE;
                });
            },
            outputs: function () {
                return this.coreData.valueHolders.filter(function (valueHolder) {
                    return valueHolder.type === OUTPUT_TYPE;
                });
            }
        },
        methods: {
            addInput: function () {
                let me = this;
                let inputPayload = {};

                me.addValueHolder(inputPayload);
            },
            addOutput: function () {
                let me = this;
                let outputPayload = {};

                me.addValueHolder(outputPayload);
            },
            addValueHolder: function (valueHolderPayload) {
                let me = this;
                let core = me.coreData;

                this.$http.post('api/Core/' + core.id + '/valueHolders', valueHolderPayload).then(response => {
                    if (response.ok) {
                        me.$emit('valueHolderAdded', response.data);
                    }
                }, err => {
                    debugger;
                });
            },
            edit: function () {

            },
            remove: function () {
                let me = this;
                let core = me.coreData;

                this.$http.delete('api/Workspaces/' + core.workspaceId + '/cores/' + core.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', core.id);
                    }
                }, err => {
                    debugger;
                });
            },
            onValueHolderCreate: function (valueHolderPayload) {
                let me = this;

                me.coreData.valueHolders.push(valueHolderPayload);
            },
            onValueHolderRemove: function (valueHolderId) {
                let me = this;
                let valueHolders = me.coreData.valueHolders;
                let valueHolderToRemove = valueHolders.find(function (valueHolder) {
                    return valueHolder.id === valueHolderId;
                });
                let indexToRemove = valueHolders.indexOf(valueHolderToRemove);

                if (indexToRemove > -1) {
                    valueHolders.splice(indexToRemove, 1);
                }
            }
        }
    }
</script>

<style scoped>
  .core-root {
    width: 520px;
    margin: 5px;
    padding: 5px;
    background-color: rgba(29, 30, 31, 0.45);
    border-radius: 5px;
  }
</style>
