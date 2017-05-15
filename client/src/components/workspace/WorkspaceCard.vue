<template>
    <div class="workspace-card-root">
        <workspace-modal-form :editMode="true"
                              :workspaceData="workspaceData"
                              @edit="edit"
                              ref="workspaceModalForm"></workspace-modal-form>

        <md-card>
            <md-card-media md-ratio="16:9">
                <img :src="workspaceData.descriptionImage" alt="Workspace Image">
            </md-card-media>

            <md-card-header><h3>{{ workspaceData.name }}</h3></md-card-header>

            <md-card-content>{{ workspaceData.description }}</md-card-content>

            <md-card-actions>
                <md-layout md-align="start" md-gutter="16">
                    <md-layout md-flex="25" md-flex-offset="2">
                        <md-button class="md-fab md-mini"
                                   @click.native="open">
                            <md-icon>apps</md-icon>
                        </md-button>
                    </md-layout>
                </md-layout>

                <md-button class="md-fab md-mini"
                           @click.native="$refs.workspaceModalForm.open()">
                    <md-icon>edit</md-icon>
                </md-button>
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
    import WorkspaceModalForm from './dialogs/WorkspaceModalForm.vue';

    export default {
        name: 'WorkspaceCard',
        components: {
            WorkspaceModalForm
        },
        props: {
            workspaceData: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {}
        },
        methods: {
            open: function () {
                let me = this;

                this.$emit('open', me.workspaceData.id)
            },
            edit: function () {
                let me = this;

                this.$emit('edit', me.workspaceData.id)
            },
            remove: function () {
                let me = this;

                this.$http.delete('api/Workspaces/' + me.workspaceData.id).then(function (response) {

                }, function (err) {

                }).then(function () {
                    this.$emit('remove', me.workspaceData.id)
                });
            }
        }
    }
</script>

<style scoped>

</style>
