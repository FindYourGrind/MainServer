// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
import VueResource from 'vue-resource';
import webSocket from './webSocket';
import VueMaterial from 'vue-material';

import 'vue-material/dist/vue-material.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Config from "../../config.json";

const accessToken = localStorage.getItem('accessToken');
const userId = localStorage.getItem('userId');

Vue.config.productionTip = false;

Vue.use(VueMaterial);
Vue.use(ClientTable);
Vue.use(BootstrapVue);
Vue.use(VueResource);

if (accessToken) {
    webSocket.connect({
        multiplex: false,
        query: {
            accessToken: accessToken,
            userId: userId
        }
    });
}

store.commit('userAccessToken', accessToken || '');
store.commit('userId', userId || -1);

Vue.http.options.root = (Config.httpOnly ? 'http' : 'https') + '://localhost:3000';
Vue.http.headers.common['Authorization'] = accessToken;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
        App
    }
});
