import Vue from 'vue'
import VueWebsocket from "vue-websocket";
import Config from "../../config.json";
import IO from "socket.io-client";

let ws = {
    isConnectionExists: false,
    protocol: Config.httpOnly ? 'ws' : 'wss',
    io: IO,
    connect: function (options) {
        let me = this;
        let host = me.protocol + '://localhost:80';

        if (me.isConnectionExists === false) {
            Vue.use(VueWebsocket, host, options);
        } else {
            Vue.prototype.$socket = IO(host, options);
        }

        me.isConnectionExists = true;
    }
};

export default ws;