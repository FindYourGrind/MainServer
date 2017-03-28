<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="user-panel">
        <transition name="user-panel-header-toggle">
            <div class="user-panel-header"
                 v-if="show">
                <img class="user-icon"
                     v-bind:src="userIconSrc"
                     width="45"
                     height="45"
                     alt="User Icon"
                     @click="show = !show"/>
            </div>
        </transition>
        <!--<div class="user-right-panel">-->

        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: 'userPanel',
        data: function () {
            return {
                userName: '',
                userIconSrc: 'img/businessman-xxl.png',
                show: true
            }
        },
        computed: {
        },
        methods: {
            openUserPanel: function () {

            }
        }
    }
</script>

<style>
    .user-panel-header {
        float: right;
        width: 50px;
        background-color: red;
    }

    .user-panel-header .user-icon {
        float: left;
        border-radius: 50%;
        background-color: white;
        border: 1px solid white;
    }

    .user-panel-header .user-icon:hover {
        background-color: rgba(203, 203, 203, 0.67);
        border: 1px solid rgba(203, 203, 203, 0.67);
    }

    .user-panel-header-toggle-enter-active, .user-panel-header-toggle-leave-active {
        transition: width .5s
    }
    .user-panel-header-toggle-enter-active-enter, .user-panel-header-toggle-enter-active-leave-to {
        width: 300px
    }

    /*.user-right-panel {*/
        /*position: absolute;*/
        /*background-color: red;*/
        /*height: 300px;*/
        /*width: 200px;*/
        /*margin: 8px 0 0 0;*/
    /*}*/
</style>
