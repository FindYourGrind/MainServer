<template>
    <div class="registration">
        <form name="registration" onsubmit="return false">
            <input type="text" name="userName" v-model.trim="userName" placeholder="User Name"/><br>
            <input type="email" name="userEmail" v-model.trim="userEmail" placeholder="User Email"/><br>
            <input type="password" name="userPassword" v-model.trim="userPassword" placeholder="User Password"/><br>
            <input type="password" name="confirmPassword" v-model.trim="confirmPassword" placeholder="Confirm Password"/><br>
            <input type="submit" name="submit" v-on:click="submit" value="Sign Up"/>
            <button v-on:click="goToLogin">Sign In</button>
        </form>
        <div v-bind:class="{ 'error-message': hasError, 'success-message': !hasError}">
            {{ infoMessage }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'registration',
        data () {
            return {
                userName: '',
                userEmail: '',
                userPassword: '',
                confirmPassword: '',
                hasError: false,
                infoMessage: ''
            }
        },
        computed: {
            isPasswordValid: function () {
                let me = this;

                return me.userPassword === me.confirmPassword;
            }
        },
        methods: {
            submit: function () {
                let me = this;

                if (me.isPasswordValid) {
                    let payload = {
                        username: me.userName,
                        email: me.userEmail,
                        password: me.userPassword
                    };

                    me.$http.post('api/Accounts', payload).then(response => {
                        if (response.ok) {
                            me.hasError = false;
                            me.infoMessage = 'Success';
                            me.$router.push({name: 'Login'});
                        }
                    }, response => {
                        me.hasError = true;
                        me.infoMessage = 'Some problems'
                    });
                } else {
                    me.hasError = true;
                    me.infoMessage = 'Passwords not equals'
                }
            },
            goToLogin: function () {
                let me = this;

                me.$router.push({name: 'Login'});
            }
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
