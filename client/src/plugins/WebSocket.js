import IO from "socket.io-client";

let onConnectionChangeListeners = [];

export default {

    install(Vue, connection, opts) {

        let socket;

        if (connection != null && typeof connection === "object")
            socket = connection;
        else
            socket = IO(connection || "", opts);

        Vue.prototype.$socket = socket;

        Vue.prototype.$socket.retrieveConnection = function (connection, opts) {
            Vue.prototype.$socket = IO(connection || "", opts);

            onConnectionChangeListeners.forEach(function (component) {
                addListeners.apply(component);
            })
        };

        let addListeners = function() {
            if (this.$options["socket"]) {
                let conf = this.$options.socket;

                onConnectionChangeListeners.push(this);

                if (conf.namespace) {
                    this.$socket = IO(conf.namespace, conf.options);
                }

                if (conf.events) {
                    let prefix = conf.prefix || "";
                    Object.keys(conf.events).forEach((key) => {
                        let func = conf.events[key].bind(this);
                        this.$socket.on(prefix + key, func);
                        conf.events[key].__binded = func;
                    });
                }
            }
        };

        let removeListeners = function() {
            if (this.$options["socket"]) {
                let conf = this.$options.socket;

                if (conf.namespace) {
                    this.$socket.disconnect();
                }

                if (conf.events) {
                    let prefix = conf.prefix || "";
                    Object.keys(conf.events).forEach((key) => {
                        this.$socket.off(prefix + key, conf.events[key].__binded);
                    });
                }
            }
        };

        Vue.mixin({
            // Vue v1.x
            beforeCompile: addListeners,

            // Vue v2.x
            beforeCreate: addListeners,


            beforeDestroy: removeListeners
        });

    }

};
