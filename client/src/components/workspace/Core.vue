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
        <md-button class="md-fab md-mini"
                   @click.native="addInput">
          <md-icon>add</md-icon>
        </md-button>
      </md-layout>
      <md-layout md-align="center">
        ID: {{ coreData.id }}
      </md-layout>
      <md-layout md-align="end">
        <md-button class="md-fab md-mini"
                   @click.native="addOutput">
        <md-icon>add</md-icon>
      </md-button></md-layout>
    </md-layout>

    <md-layout md-align="center">
      <md-layout md-align="start">
          <value-holder v-for="input in inputs"
                        :key="input.id"
                        :valueHolderData="input"></value-holder>
      </md-layout>
      <md-layout md-align="end">
        <value-holder v-for="output in outputs"
                      :key="output.id"
                      :valueHolderData="output"></value-holder>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
    import ValueHolder from "./ValueHolder.vue";

    const INPUT_TYPE = 1;
    const OUTPUT_TYPE = 2;

    export default {
        name: 'Core',
        props: ['coreData'],
        components: {
            ValueHolder
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

            },
            removeInput: function () {

            },
            addOutput: function () {

            },
            removeOutput: function () {

            },
            editValueHolder: function () {

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
            }
        }
    }
</script>

<style scoped>
  .core-root {
    width: 300px;
    margin: 5px;
    padding: 5px;
    background-color: rgba(29, 30, 31, 0.45);
    border-radius: 5px;
  }
</style>
