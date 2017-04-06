<template>
    <div class="value-holder-root">
        <md-layout md-align="center">
            <md-layout md-align="start">
                <p>Input: {{ valueHolderData.name }}</p>
                <p>ID: {{ valueHolderData.id }}</p>
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
    </div>
</template>

<script>
    export default {
        name: 'ValueHolder',
        props: ['valueHolderData'],
        data: function () {
            return {}
        },
        methods: {
            edit: function () {

            },
            remove: function () {
                let me = this;
                let valueHolder = me.valueHolderData;

                this.$http.delete('api/Core/' + valueHolder.coreId + '/valueHolders/' + valueHolder.id).then(response => {
                    if (response.ok) {
                        me.$emit('remove', valueHolder.id);
                    }
                }, err => {
                    debugger;
                });
            }
        }
    }
</script>

<style scoped>
    .value-holder-root {
        width: 145px;
        height: 100px;
        margin: 5px;
        padding: 5px;
        background-color: rgba(235, 147, 22, 0.45);
    }
</style>
