<template>
  <div class="app-wrapper">
    <div id="app">
      <app-header></app-header>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
    import AppHeader from "./components/AppHeader.vue";

    export default {
        name: 'app',
        components: {
            AppHeader
        },
        socket: {
            events: {
                connect() {
                    console.log("Websocket connected to " + this.$socket.nsp);
                }
            }
        }
    }
</script>

<style>
  .app-wrapper {
    text-align: center;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: inline-block;
    margin-top: 60px;
    text-align: center;
    width: 100%;
  }
</style>
