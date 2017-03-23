<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="hello">
        <button v-on:click="logout">Logout</button>
        <button v-on:click="test">Test Reauest</button>
        <div>
            {{ requestResult }}
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapGetters } from 'vuex';

    export default {
        name: 'mainPage',
        data () {
            return {
                requestResult: ''
            }
        },
        methods: {
            logout: function () {
                let me = this;

                me.$http.post('http://localhost:3000/api/Accounts/logout');
                Vue.http.headers.common['Authorization'] = '';
                me.$router.push({ name: 'Login'});
            },
            test: function () {
                let me = this;

                me.$http.get('http://localhost:3000/api/Accounts/' + me.getUserId()).then(response => {
                    me.requestResult = response.data;
                }, response => {
                    debugger;
                });
            },
            ...mapGetters({
                getUserId: 'userId'
            })
        }
    }
</script>

<style scoped>

</style>
