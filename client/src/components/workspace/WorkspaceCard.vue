<template>
    <md-card>
        <md-card-media md-ratio="16:9">
            <img :src="iconSrc" alt="Workspace Image">
        </md-card-media>

        <md-card-header><h3>{{ title }}</h3></md-card-header>

        <md-card-content>{{ description }}</md-card-content>

        <md-card-actions>
            <md-layout md-align="start" md-gutter="16">
                <md-layout md-flex="25" md-flex-offset="2">
                    <md-button class="md-fab md-mini"
                               @click.native="open(itemId)">
                        <md-icon>apps</md-icon>
                    </md-button>
                </md-layout>
            </md-layout>

            <md-button class="md-fab md-mini"
                       @click.native="edit(itemId)">
                <md-icon>edit</md-icon>
            </md-button>
            <md-button class="md-fab md-mini"
                       @click.native="remove(itemId)">
                <md-icon>delete</md-icon>
            </md-button>
        </md-card-actions>
    </md-card>
</template>

<script>
    export default {
        name: 'WorkspaceCard',
        props: ['itemId', 'title', 'description', 'iconSrc'],
        data: function () {
            return {}
        },
        methods: {
            open: function (id) {
                this.$emit('open', id)
            },
            edit: function (id) {
                this.$emit('edit', id)
            },
            remove: function (id) {
                this.$http.delete('api/Workspaces/' + id).then(function (response) {

                }, function (err) {

                }).then(function () {
                    this.$emit('remove', id)
                });
            }
        }
    }
</script>

<style scoped>

</style>
