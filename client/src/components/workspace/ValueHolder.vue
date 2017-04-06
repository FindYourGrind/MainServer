<template v-if="">
    <div class="value-holder-root" v-if="leftToRight">
        <md-layout md-align="center">
            <md-layout md-align="start">
                <md-button class="md-fab md-mini"
                           @click.native="remove">
                    <md-icon>delete</md-icon>
                </md-button>
                <md-button class="md-fab md-mini"
                           @click.native="edit">
                    <md-icon>edit</md-icon>
                </md-button>
            </md-layout>
            <md-layout md-align="end">
                Input: {{ valueHolderData.name }}<br>
                ID: {{ valueHolderData.id }}<br>
            </md-layout>
        </md-layout>
    </div>
    <div class="value-holder-root" v-else>
        <md-layout md-align="center">
            <md-layout md-align="start">
                Input: {{ valueHolderData.name }}<br>
                ID: {{ valueHolderData.id }}<br>
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
        props: ['valueHolderData', 'leftToRight'],
        data: function () {
            return {}
        },
        methods: {
            edit: function () {

            },
            remove: function () {
                let me = this;
                let valueHolder = me.valueHolderData;

                this.$http.delete('api/Cores/' + valueHolder.coreId + '/valueHolders/' + valueHolder.id).then(response => {
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
        width: 240px;
        height: 65px;
        margin: 5px;
        padding: 5px;
        background-color: rgba(235, 147, 22, 0.45);
        border-radius: 5px;
    }
</style>
