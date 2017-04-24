<template>
    <div class="workspace-editor-root">
        <div class="workspace-editor-scroll">
            <md-layout md-gutter="8">
                <md-layout md-flex="true"
                           md-align="start">
                    <md-whiteframe md-elevation="3">
                        <create-source-modal-form :workspaceData="workspace"
                                                  @create="ocSourceCreate"></create-source-modal-form>
                        <source-component v-for="source in workspace.relatedSources"
                                          :key="source.id"
                                          :workspaceData="workspace"
                                          :sourceData="source"
                                          :ref="'source' + source.id"
                                          @remove="onSourceRemove"></source-component>
                    </md-whiteframe>
                </md-layout>
                <svg id="sourceToInputConnectivity"
                     class="source-to-input-connectivity"
                     ref="sourceToInputConnectivity"></svg>
                <md-layout md-flex="true"
                           md-align="center">
                    <md-whiteframe md-elevation="3">
                        <create-core-modal-form :workspaceId="workspace.id"
                                                @create="onCoreCreate"></create-core-modal-form>
                        <core v-for="core in workspace.relatedCores"
                              :key="core.id"
                              :workspaceData="workspace"
                              :coreData="core"
                              @remove="onCoreRemove"></core>
                    </md-whiteframe>
                </md-layout>
                <svg id="sinkToOutputConnectivity"
                     class="sink-to-output-connectivity"
                     ref="sinkToOutputConnectivity"></svg>
                <md-layout md-flex="true"
                           md-align="end">
                    <md-whiteframe md-elevation="3">
                        <create-sink-modal-form :workspaceData="workspace"
                                                @create="onSinkCreate"></create-sink-modal-form>
                        <sink-component v-for="sink in workspace.relatedSinks"
                                        :key="sink.id"
                                        :workspaceData="workspace"
                                        :sinkData="sink"
                                        @remove="onSinkRemove"></sink-component>
                    </md-whiteframe>
                </md-layout>
            </md-layout>
        </div>
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
                corePayload.relatedInputs = [];
                corePayload.relatedOutputs = [];
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
        },
        updated: function () {
            let me = this;
            let sourceToInputConnectivity = me.$refs['sourceToInputConnectivity'];
            let svgRect = sourceToInputConnectivity.getBoundingClientRect();

            me.workspace.relatedSources.forEach(function (source) {
                if (source.connected === true) {
                    source.inputIdList.forEach(function (inputId) {
                        let sourceEl = me.$refs['source' + source.id][0].$el;
                        let sourceRect = sourceEl.getBoundingClientRect();
                        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

                        newLine.setAttribute('id', 'source-' + source.id + '-to-input-' + inputId + '-line');
                        newLine.setAttribute('x1', svgRect.left);
                        newLine.setAttribute('y1', sourceRect.top - svgRect.top + (sourceRect.height / 2));
                        newLine.setAttribute('x2', '0');
                        newLine.setAttribute('y2', sourceRect.top - svgRect.top + (sourceRect.height / 2));
                        newLine.setAttribute("stroke", "black");

                        sourceToInputConnectivity.append(newLine);
                    });
                }
            });
        }
    }
</script>

<style scoped>
    .workspace-editor-root {
        width: auto;
        overflow-x: scroll;
    }

    .workspace-editor-scroll {

    }

    .source-to-input-connectivity {
        background-color: red;
        width: 165px;
    }

    .sink-to-output-connectivity {
        background-color: red;
        width: 165px;
    }
</style>
