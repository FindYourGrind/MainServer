<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="hello">
        <button v-on:click="test">Test Request</button>
        <div>
            {{ requestResult }}
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'mainPage',
        data () {
            return {
                requestResult: ''
            }
        },
        methods: {
            test: function () {
                let me = this;

                me.$http.get('api/Accounts/' + me.getUserId()).then(response => {
                    me.requestResult = response.data;
                }, response => {
                    debugger;
                });
            },
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName'
            }),
            ...mapMutations({
                removeAccessToken: 'removeUserAccessToken',
                removeUserId: 'removeUserId'
            })
        }
    }
</script>

<style scoped>

</style>
