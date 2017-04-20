<template>
    <div class="workspace-editor-root">
        <md-layout md-gutter="8">
            <md-layout md-flex="true"
                       md-align="start">
                <md-whiteframe md-elevation="3">
                    <create-source-modal-form :workspace="workspace"
                                              @create="ocSourceCreate"></create-source-modal-form>
                    <source-component v-for="source in workspace.relatedSources"
                                      :key="source.id"
                                      :sourceData="source"
                                      @remove="onSourceRemove"></source-component>
                </md-whiteframe>
            </md-layout>
            <md-layout md-flex="true"
                       md-align="center">
                <md-whiteframe md-elevation="3">
                    <create-core-modal-form :workspaceId="workspace.id"
                                            @create="onCoreCreate"></create-core-modal-form>
                    <core v-for="core in workspace.relatedCores"
                          :key="core.id"
                          :coreData="core"
                          @remove="onCoreRemove"></core>
                </md-whiteframe>
            </md-layout>
            <md-layout md-flex="true"
                       md-align="end">
                <md-whiteframe md-elevation="3">
                    <create-sink-modal-form :workspaceId="workspace.id"
                                            @create="onSinkCreate"></create-sink-modal-form>
                    <sink-component v-for="sink in workspace.relatedSinks"
                                    :key="sink.id"
                                    :sinkData="sink"
                                    @remove="onSinkRemove"></sink-component>
                </md-whiteframe>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import Core from './Core.vue';
    import CreateCoreModalForm from './CreateCoreModalForm.vue';
    import CreateSourceModalForm from './CreateSourceModalForm.vue';
    import CreateSinkModalForm from './CreateSinkModalForm.vue';
    import SourceComponent from './SourceComponent.vue';
    import SinkComponent from './SinkComponent.vue';

    const CORES_STRING = 'relatedCores';
    const SOURCES_STRING = 'relatedSources';
    const SINKS_STRING = 'relatedSinks';

    export default {
        name: 'WorkspaceEditor',
        props: ['workspace'],
        components: {
            Core,
            SourceComponent,
            SinkComponent,
            CreateCoreModalForm,
            CreateSourceModalForm,
            CreateSinkModalForm
        },
        data: function () {
            return {}
        },
        methods: {
            /**
             *
             * @param sourcePayload
             */
            ocSourceCreate: function (sourcePayload) {
                this.addWorkspaceSubject(SOURCES_STRING, sourcePayload);
            },

            /**
             *
             * @param corePayload
             */
            onCoreCreate: function (corePayload) {
                corePayload.valueHolders = [];
                this.addWorkspaceSubject(CORES_STRING, corePayload);
            },

            /**
             *
             * @param sinkPayload
             */
            onSinkCreate: function (sinkPayload) {
                this.addWorkspaceSubject(SINKS_STRING, sinkPayload);
            },

            /**
             *
             * @param sourceId
             */
            onSourceRemove: function (sourceId) {
                this.removeWorkspaceSubject(SOURCES_STRING, sourceId);
            },

            /**
             *
             * @param sinkId
             */
            onSinkRemove: function (sinkId) {
                this.removeWorkspaceSubject(SINKS_STRING, sinkId);
            },

            /**
             *
             * @param coreId
             */
            onCoreRemove: function (coreId) {
                this.removeWorkspaceSubject(CORES_STRING, coreId);
            },

            /**
             *
             * @param subjectName
             * @param subjectPayload
             */
            addWorkspaceSubject: function (subjectName, subjectPayload) {
                let me = this;

                me.workspace[subjectName].push(subjectPayload);
            },

            /**
             *
             * @param subjectName
             * @param subjectId
             */
            removeWorkspaceSubject: function (subjectName, subjectId) {
                let me = this;
                let subjects = me.workspace[subjectName];
                let subjectToRemove = subjects.find(function (subject) {
                    return subject.id == subjectId;
                });
                let indexToRemove = subjects.indexOf(subjectToRemove);

                if (indexToRemove !== -1) {
                    subjects.splice(indexToRemove, 1);
                }
            }
        }
    }
</script>

<style scoped>
    .workspace-editor-root {

    }
</style>
