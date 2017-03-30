<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="user-panel">
        <transition name="expand">
            <div v-if="fullUserPanelVisible" class="user-panel-header">
                <div class="user-name">{{ userName }}</div>
                <div class="logout-icon"
                     @click="logout">
                </div>
            </div>
        </transition>
        <div class="user-panel-header-icon">
            <img class="user-icon"
                 :src="avatarURL"
                 width="60"
                 height="60"
                 alt="User Icon"
                 @click="fullUserPanelVisible = !fullUserPanelVisible"/>
            <!--<md-avatar @click.native="fullUserPanelVisible = !fullUserPanelVisible">-->
              <!--<img :src="avatarURL" alt="User Icon">-->
            <!--</md-avatar>-->
        </div>
        <transition name="fade">
            <div v-if="fullUserPanelVisible" class="user-right-panel">

            </div>
        </transition>
    </div>
    <!--v-bind:src="userIconSrc"-->
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'userPanel',
        data: function () {
            return {
                userIconSrc: '../assets/businessman-xxl.png',
                fullUserPanelVisible: false
            }
        },
        computed: {
            userName: function () {
                let me = this;

                return me.getUserName();
            },
            avatarURL: function () {
                let me = this;

                return me.getUserAvatarURL();
            }
        },
        methods: {
            logout: function () {
                let me = this;

                me.$http.post('api/Accounts/logout');

                me.$socket.close();

                me.removeAccessToken();
                me.removeUserId();

                me.$router.push({ name: 'Login'});
            },
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName',
                getUserAvatarURL: 'userAvatarURL'
            }),
            ...mapMutations({
                removeAccessToken: 'removeUserAccessToken',
                removeUserId: 'removeUserId'
            })
        }
    }
</script>

<style scoped>

    .user-panel {
        width: 400px;
        display: inline;
    }

    .user-panel-header-icon {
        width: 60px;
        height: 60px;
        min-width: 60px;
        min-height: 60px;
        background-color: rgba(118, 118, 118, 0.69);
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        display: inline-block;
    }

    .user-panel-header-icon .user-icon {
        float: left;
        border-radius: 23px;
        background-color: white;
        /*border: 1px solid white;*/
        /*margin: 7px;*/
    }

    .user-panel-header-icon .user-icon:hover {
        background-color: rgba(203, 203, 203, 0.67);
        border: 1px solid rgba(203, 203, 203, 0.67);
    }

    .user-panel-header {
        float: right;
        left: 100%;
        width: 340px;
        height: 60px;
        background-color: rgba(118, 118, 118, 0.69);
        display: inline-block;
        /*text-align: -webkit-right;*/
    }

    .user-right-panel {
        position: fixed;
        top: 60px;
        float: right;
        background-color: rgba(118, 118, 118, 0.69);
        height: 100%;
        width: 340px;
        margin-left: 60px;
    }

    .logout-icon {
        /*display: inline-block;*/
        width: 36px;
        height: 36px;
        background-image: url('../assets/logout-512.png');
        background-size: 36px;
        opacity: 0.75;
        margin: 11px 11px 11px 290px;
    }

    .logout-icon:hover {
        opacity: 1;
    }

    .user-name {
        margin: 7px;
        display: inline-block;
        float: left;
        color: white;
        font: 'helvetica neue', helvetica, arial, sans-serif;
        font-size: 20px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s
    }
    .fade-enter, .fade-leave-to {
        opacity: 0
    }

    .expand-enter-active, .expand-leave-active {
        transition: width 0.5s
    }
    .expand-enter, .expand-leave-to {
        width: 0
    }
</style>
