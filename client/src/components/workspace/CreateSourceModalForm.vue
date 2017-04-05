<template>
    <div>
        <md-button class="md-primary md-raised"
                   id="openCreateSourceModalFormButton"
                   @click.native="open">Create Source</md-button>

        <md-dialog md-open-from="#openCreateSourceModalFormButton"
                   ref="createSourceModalForm">
            <md-dialog-title>Create new Source</md-dialog-title>

            <md-dialog-content>
                <form novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <label>Type</label>
                        <md-input required v-model.trim="sourceType"></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Mapping</label>
                        <md-input v-model.trim="sourceMapping"></md-input>
                    </md-input-container>
                </form>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="close">Close</md-button>
                <md-button class="md-primary" @click.native="save">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script>
    export default {
        name: 'CreateSourceModalForm',
        props: ['workspaceId'],
        data: function () {
            return {
                sourceType: '',
                sourceMapping: ''
            }
        },
        methods: {
            open: function () {
                this.$refs['createSourceModalForm'].open();
            },
            save: function () {
                this.$http.post('api/Workspaces/' + this.workspaceId + '/sources', {
                    type: this.sourceType,
                    mapping: this.sourceMapping
                }).then(function (response) {
                    if (response.ok) {
                        return response.data;
                    } else {
                        console.log('Error while saving the source data');
                    }
                }, function () {
                    console.log('Error while saving the source data');
                }).then(function (sourcePayload) {
                    this.$emit('create', sourcePayload);
                }).then(this.close);
            },
            close: function () {
                this.resetFormData();
                this.$refs['createSourceModalForm'].close();
            },
            resetFormData: function () {
                this.sourceType = '';
                this.sourceMapping = '';
            }
        }
    }
</script>

<style scoped>

</style>
