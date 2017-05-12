<template>
    <div class="workspace-editor-root">
        <source-modal-form :workspaceData="workspace"
                           @create="ocSourceCreate"
                           ref="sourceModalForm"></source-modal-form>

        <md-layout>
            <md-layout></md-layout>
            <md-layout>
                <div class="source-container-wrapper">
                    <div class="source-container-header">
                        <md-button @click.native="$refs.sourceModalForm.open()">Create Source</md-button>
                    </div>
                    <div class="source-container">
                        <source-component v-for="source in workspace.relatedSources"
                                          :key="source.id"
                                          :workspaceData="workspace"
                                          :sourceData="source"
                                          :ref="'source' + source.id"
                                          @remove="onSourceRemove"></source-component>
                    </div>
                </div>
            </md-layout>
            <md-layout>
                <svg id="sourceToInputConnectivity"
                     class="source-to-input-connectivity"
                     ref="sourceToInputConnectivity"></svg>
            </md-layout>
            <md-layout>
                <div class="core-container-wrapper">
                    <div class="core-container-header">
                        <create-core-modal-form :workspaceId="workspace.id"
                                                @create="onCoreCreate"></create-core-modal-form>
                    </div>
                    <div class="core-container">
                        <core v-for="core in workspace.relatedCores"
                              :key="core.id"
                              :workspaceData="workspace"
                              :coreData="core"
                              @remove="onCoreRemove"></core>
                    </div>
                </div>
            </md-layout>
            <md-layout>
                <svg id="sinkToOutputConnectivity"
                     class="sink-to-output-connectivity"
                     ref="sinkToOutputConnectivity"></svg>
            </md-layout>
            <md-layout>
                <div class="sink-container-wrapper">
                    <div class="sink-container-header">
                        <create-sink-modal-form :workspaceData="workspace"
                                                @create="onSinkCreate"></create-sink-modal-form>
                    </div>
                    <div class="sink-container">
                        <sink-component v-for="sink in workspace.relatedSinks"
                                        :key="sink.id"
                                        :workspaceData="workspace"
                                        :sinkData="sink"
                                        :ref="'sink' + sink.id"
                                        @remove="onSinkRemove"></sink-component>
                    </div>
                </div>
            </md-layout>
            <md-layout></md-layout>
        </md-layout>
    </div>
</template>

<script>
    import Core from './Core.vue';
    import CreateCoreModalForm from './CreateCoreModalForm.vue';
    import SourceModalForm from './SourceModalForm.vue';
    import CreateSinkModalForm from './CreateSinkModalForm.vue';
    import SourceComponent from './SourceComponent.vue';
    import SinkComponent from './SinkComponent.vue';
    import * as d3 from 'd3';

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
            SourceModalForm,
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
            },
            drawConnection: function (target, id, x1, y1, x2, y2) {
                let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

                newLine.setAttribute('id', id);
                newLine.setAttribute('x1', x1);
                newLine.setAttribute('y1', y1);
                newLine.setAttribute('x2', x2);
                newLine.setAttribute('y2', y2);
                newLine.setAttribute("stroke", "black");
                newLine.setAttribute("stroke-width", '3');

                target.append(newLine);
            },
            updateConnectivity: function () {
                let me = this;
                let sourceToInputConnectivity = me.$refs['sourceToInputConnectivity'];
                let sinkToOutputConnectivity = me.$refs['sinkToOutputConnectivity'];
                let leftSvgRect = sourceToInputConnectivity.getBoundingClientRect();
                let rightSvgRect = sinkToOutputConnectivity.getBoundingClientRect();

                d3.select(sourceToInputConnectivity).selectAll("svg > *").remove();
                d3.select(sinkToOutputConnectivity).selectAll("svg > *").remove();

                me.workspace.relatedSources.forEach(function (source) {
                    if (source.connected === true) {
                        source.inputIdList.forEach(function (inputId) {
                            let sourceEl = me.$refs['source' + source.id][0].$el;
                            let sourceRect = sourceEl.getBoundingClientRect();
                            let inputEl = me.$el.querySelector("#input" + inputId);
                            let inputRect = inputEl.getBoundingClientRect();

                            me.drawConnection(sourceToInputConnectivity,
                                'source-' + source.id + '-to-input-' + inputId + '-line',
                                0,
                                sourceRect.top - leftSvgRect.top + (sourceRect.height / 2),
                                leftSvgRect.width,
                                inputRect.top - leftSvgRect.top + (inputRect.height / 2));
                        });
                    }
                });

                me.workspace.relatedSinks.forEach(function (sink) {
                    if (sink.connected === true) {
                        let sinkEl = me.$refs['sink' + sink.id][0].$el;
                        let sinkRect = sinkEl.getBoundingClientRect();
                        let outputEl = me.$el.querySelector("#output" + sink.outputId);
                        let outputRect = outputEl.getBoundingClientRect();

                        me.drawConnection(sinkToOutputConnectivity,
                            'sink-' + sink.id + '-to-output-' + sink.outputId + '-line',
                            0,
                            outputRect.top - rightSvgRect.top + (outputRect.height / 2),
                            rightSvgRect.width,
                            sinkRect.top - rightSvgRect.top + (sinkRect.height / 2));
                    }
                });
            }
        },
        updated: function () {
            let me = this;

            me.updateConnectivity();
        },
        socket: {
            events: {
                'models-global-update': function () {
                    let me = this;

                    me.updateConnectivity();
                }
            }
        }
    }
</script>

<style scoped>
    .workspace-editor-root {
    }

    .source-to-input-connectivity {
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .sink-to-output-connectivity {
        margin: 0;
        padding: 0;
        width: 100%;
    }
</style>
