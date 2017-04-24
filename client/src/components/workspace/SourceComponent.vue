<template>
    <div class="source-root">
        <md-layout md-align="center">
            <md-layout md-align="start">
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
                <create-source-modal-form :workspaceData="workspaceData"
                                          :sourceData="sourceData"
                                          @edit="edit">
                </create-source-modal-form>
            </md-layout>
            <md-layout md-align="end">
                Input: {{ sourceData.name }}<br>
                ID: {{ sourceData.id }}<br>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import CreateSourceModalForm from './CreateSourceModalForm.vue';

    export default {
        name: 'SourceComponent',
        props: ['workspaceData', 'sourceData'],
        components: {
            CreateSourceModalForm
        },
        data: function () {
            return {}
        },
        computed: {

        },
        methods: {
            edit: function () {

            },
            remove: function () {
                let me = this;
                let source = me.sourceData;

                this.$http.delete('api/Sources/' + source.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', source.id);
                    }
                }, err => {
                    console.log(err);
                });
            },
        }
    }
</script>

<style scoped>
    .source-root {
        width: 240px;
        height: 65px;
        margin: 15px 5px 15px 5px;
        padding: 5px;
        background-color: rgba(235, 147, 22, 0.45);
        border-radius: 5px;
    }
</style>
