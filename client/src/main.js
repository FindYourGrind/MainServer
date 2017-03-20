// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueWebsocket from "vue-websocket";
import store from './store'
import BootstrapVue from 'bootstrap-vue';
import {ServerTable, ClientTable, Event} from 'vue-tables-2';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Config from "../../config.json";

Vue.use(VueWebsocket, "ws://localhost:3000");
Vue.use(ClientTable);
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
