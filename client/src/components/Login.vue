<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="login">

    <span class="md-display-2">Login</span>

    <form novalidate @submit.stop.prevent="submit">

      <md-input-container>
        <label>Email</label>
        <md-input type="email" required v-model.trim="userEmail"></md-input>
      </md-input-container>

      <md-input-container md-has-password>
        <label>Password</label>
        <md-input type="password" required v-model.trim="userPassword"></md-input>
      </md-input-container>

      <md-button class="md-raised" v-on:click.native="submit">Login</md-button>
      <md-button class="md-raised md-primary" v-on:click.native="goToRegistration">Sign Up</md-button>
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

  .login {
    width: 100%;
    margin-top: 50px;
    text-align: center;
  }

  .login form {
    width: 300px;
  }

    .error-message {
        color: red;
    }

    .success-message {
        color: green;
    }
</style>
