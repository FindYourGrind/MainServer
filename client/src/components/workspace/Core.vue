<template>
  <div class="core-root">
    <md-layout md-align="center">
      <md-layout md-align="center">
        Header
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
      <md-layout md-align="center">Core</md-layout>
      <md-layout md-align="end">
        <md-button class="md-fab md-mini"
                   @click.native="addOutput">
        <md-icon>add</md-icon>
      </md-button></md-layout>
    </md-layout>

    <md-layout md-align="center">
      <md-layout md-align="start">

      </md-layout>
      <md-layout md-align="end">

      </md-layout>
    </md-layout>
  </div>
</template>

<script>
  export default {
    name: 'Core',
    props: ['coreData'],
    data: function () {
      return {}
    },
    methods: {
      addInput: function () {

      },
      removeInput: function () {

      },
      edit: function () {

      },
      remove: function () {
        let me = this;
        let core = me.coreData;

        this.$http.delete('api/Workspaces/' + core.workspaceId + '/' + subjectName + '/' + subjectId).then(response => {
          if (response.ok) {
            let workspaceSubjects = me.workspaces.find(function (workspace) {
              return workspace.id == workspaceId;
            })[subjectName];
            let subjectToRemove = workspaceSubjects.find(function (subjectItem) {
              return subjectItem.id == subjectId;
            });
            let indexToRemove = workspaceSubjects.indexOf(subjectToRemove);

            if (indexToRemove !== -1) {
              workspaceSubjects.splice(indexToRemove, 1);
            }
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
  }
</style>
