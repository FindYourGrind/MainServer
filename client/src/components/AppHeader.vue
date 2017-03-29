<template>
    <div class="app-header">
        <div class="header-logo">SinkSource</div>
        <div>

        </div>
        <transition name="fade">
            <div class="header-user-panel" v-if="isLoggedIn">
                <user-panel></user-panel>
            </div>
        </transition>
    </div>
</template>

<script scoped>
    import { mapGetters, mapMutations } from 'vuex';
    import UserPanel from './UserPanel.vue';

    export default {
        name: 'appHeader',
        computed: {
          isLoggedIn: function () {
              let me = this;

              return me.isLogged();
          }
        },
        components: {
            UserPanel
        },
        methods: {
            ...mapGetters({
                isLogged: 'isLogged'
            })
        }
    }
</script>

<style>
    .app-header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background-color: rgba(0, 0, 0, 0.85);
    }

    .header-logo {
        position: inherit;
        font: 900 330%/100% "Lucida Grande";
        font-style: italic;
        color: white;
        margin: 2px 0 0 10px;
    }

    .header-user-panel {
        float: right;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s
    }
    .fade-enter, .fade-leave-to {
        opacity: 0
    }
</style>
