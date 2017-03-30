<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="registration">

    <span class="md-display-2">Registration</span>

    <form novalidate @submit.stop.prevent="submit">

      <md-input-container>
        <label>Name</label>
        <md-input type="text" required v-model.trim="userName"></md-input>
      </md-input-container>

      <md-input-container>
        <label>Email</label>
        <md-input type="email" required v-model.trim="userEmail"></md-input>
      </md-input-container>

      <md-input-container>
        <label>Password</label>
        <md-input type="password" required v-model.trim="userPassword"></md-input>
      </md-input-container>

      <md-input-container>
        <label>Confirm Password</label>
        <md-input type="password" required v-model.trim="confirmPassword"></md-input>
      </md-input-container>

      <md-input-container @change.native="onAvatarImageChange">
        <label>Description Image</label>
        <md-file v-model.trim="userAvatarImageName"></md-file>
      </md-input-container>

      <md-button class="md-raised" v-on:click.native="submit">Sign Up</md-button>
      <md-button class="md-raised md-primary" v-on:click.native="goToLogin">Sign In</md-button>
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
                userAvatarImageName: '',
                userAvatarImage: null,
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
                        password: me.userPassword,
                        avatarUrl: 'api/FileContainers/ImagesContainer/download/' + me.userAvatarImageName
                    };

                  this.$http.post('api/FileContainers/ImagesContainer/upload', this.userAvatarImage, {
                    headers: {
                      "Content-Type": "multipart/form-data"
                    }
                  }).then(response => {
                    return;
                  }, err => {
                    debugger;
                  }).then(function () {
                    me.$http.post('api/Accounts', payload).then(response => {
                      if (response.ok) {
                      me.hasError = false;
                      me.infoMessage = 'Success';
                      me.$router.push({name: 'Login'});
                    }
                  }, err => {
                      me.hasError = true;
                      me.infoMessage = 'Some problems'
                    });
                  });
                } else {
                    me.hasError = true;
                    me.infoMessage = 'Passwords not equals'
                }
            },
            goToLogin: function () {
                let me = this;

                me.$router.push({name: 'Login'});
            },
            onAvatarImageChange: function (e) {
              let files = e.target.files || e.dataTransfer.files;

              this.userAvatarImage = new FormData();
              this.userAvatarImage.append('result', files[0]);
            }
        }
    }
</script>

<style scoped>

  .registration {
    width: 100%;
    margin-top: 50px;
    text-align: center;
  }

  .registration form {
    width: 300px;
  }

    .error-message {
        color: red;
    }

    .success-message {
        color: green;
    }
</style>
