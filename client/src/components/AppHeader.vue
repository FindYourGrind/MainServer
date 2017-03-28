<template>
    <div class="app-header">
        <div class="header-logo">
            <img src="../assets/SinkSourceLogo.png" width="255" height="47" alt="Logo"/>
        </div>
        <div>

        </div>
        <div class="header-user-panel">
            <user-panel></user-panel>
        </div>
    </div>
</template>

<script>
    import UserPanel from './UserPanel.vue';

    export default {
        name: 'appHeader',
        components: {
            UserPanel
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
        margin: 6px 0 0 6px;
    }

    .header-user-panel {
        float: right;
        margin: 7px 26px 0 0;
    }
</style>
