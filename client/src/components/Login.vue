<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="login">
        <form name="login" onsubmit="return false">
            <input type="email" name="userEmail" v-model.trim="userEmail" placeholder="User Email"/><br>
            <input type="password" name="userPassword" v-model.trim="userPassword" placeholder="User Password"/><br>
            <input type="submit" name="submit" v-on:click="submit" value="Login"/>
            <button v-on:click="goToRegistration">Sign Up</button>
        </form>
        <div v-bind:class="{ 'error-message': hasError, 'success-message': !hasError}">
            {{ infoMessage }}
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import webSocket from '../webSocket';
    import { mapMutations, mapGetters } from 'vuex';

    export default {
        name: 'login',
        data: function () {
            return {
                userEmail: '',
                userPassword: '',
                infoMessage: '',
                hasError: false
            }
        },
        methods: {
            submit: function () {
                let me = this;
                let payload = {
                    email: me.userEmail,
                    password: me.userPassword
                };

                me.$http.post('api/Accounts/login', payload).then(response => {
                    if (response.ok && response.data.id) {
                        me.setAccessToken(response.data.id);

                        webSocket.connect({
                            query: {
                                accessToken: response.data.id,
                                userId: response.data.userId
                            }
                        });

                        return response.data;
                    }
                }).then(data => {
                    me.$http.get('api/Accounts/' + data.userId).then(response => {
                        if (response.ok) {
                            me.setUserId(response.data.id);
                            me.setUserName(response.data.username);
                            me.setUserEmail(response.data.email);

                            me.hasError = false;
                            me.infoMessage = "Success";

                            me.$router.push({name: 'MainPage'});
                        }
                    })
                }).catch(err => {
                    me.removeAccessToken();
                    me.removeUserId();

                    me.hasError = true;
                    me.infoMessage = 'ERROR';
                });
            },
            goToRegistration: function () {
                let me = this;

                me.$router.push({name: 'Registration'});
            },
            ...mapMutations({
                setUserId: 'userId',
                setUserName: 'userName',
                setUserEmail: 'userEmail',
                setAccessToken: 'userAccessToken',
                removeAccessToken: 'removeUserAccessToken',
                removeUserId: 'removeUserId'
            })
        }
    }

</script>

<style scoped>
    input {
        margin: 4px;
        padding-left: 4px;
    }

    .error-message {
        color: red;
    }

    .success-message {
        color: green;
    }
</style>
