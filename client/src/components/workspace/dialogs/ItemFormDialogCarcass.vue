<template>
    <md-dialog ref="itemModalForm">
        <md-dialog-title>{{ getDialogTitle() }}</md-dialog-title>

        <md-dialog-content class="dialog-content">
            <form novalidate @submit.stop.prevent="submit">
                <slot>
                    You should put here your oun form fields!
                </slot>
            </form>
            <md-chip v-if="dialogError" @delete="closeDialogError" md-deletable>
                {{ dialogError }}
            </md-chip>
        </md-dialog-content>

        <md-dialog-actions>
            <md-button class="md-primary" @click.native="close">Close</md-button>
            <md-button class="md-primary" @click.native="save">Save</md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
    export default {
        name: 'ItemFormDialogCarcass',
        props: {
            editMode: {
                type: Boolean,
                default: false
            },
            subject: {
                type: String,
                required: true
            },
            subjectData: {
                type: Object,
                required: false
            }
        },
        data: function () {
            return {
                dialogError: false
            }
        },
        methods: {
            open: function () {
                let me = this;

                me.$emit('beforeOpen', me);

                me.$refs['itemModalForm'].open();

                me.$emit('afterOpen', me);
            },

            /**
             *
             */
            save: function () {
                let me = this;

                me.$emit('onSave', me)
            },

            /**
             *
             */
            close: function () {
                let me = this;

                me.$emit('beforeClose', me);

                me.$refs['itemModalForm'].close();

                me.$emit('afterClose', me);
            },

            /**
             *
             * @param error
             */
            showDialogError: function (error) {
                let me = this;

                me.dialogError = error;
            },

            /**
             *
             */
            closeDialogError: function () {
                let me = this;

                me.dialogError = false;
            },

            /**
             *
             */
            getDialogTitle: function () {
                let me = this;

                return me.editMode ?
                    `Edit ${ me.subject }: ${ me.subjectData.name } (${ me.subjectData.id })` :
                    `Create new ${ me.subject }`;
            }
        }
    }
</script>

<style scoped>

</style>
