// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueWebsocket from "vue-websocket";
import store from './store'
import BootstrapVue from 'bootstrap-vue';
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
import VueResource from 'vue-resource';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Config from "../../config.json";

const accessToken = localStorage.getItem('accessToken');
const userId = localStorage.getItem('userId');

Vue.config.productionTip = false;

Vue.use(ClientTable);
Vue.use(BootstrapVue);
Vue.use(VueResource);

if (accessToken) {
    Vue.use(VueWebsocket, "ws://localhost:3000", {
        query: {
            accessToken: accessToken
        }
    });
}

store.commit('userAccessToken', accessToken);
store.commit('userId', userId);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
        App
    },
    http: {
        root: '/api',
        headers: {
            Authorization: accessToken
        }
    }
});
