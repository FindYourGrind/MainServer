let Source = require('./Source');
let SocketClient = require('socket.io-client');

class WebSocketSource extends Source {

    constructor () {
        super(...arguments);

        this.socketClient = null;
        this.url = '';
    }

    init () {
        let me = this;
        let sourceData = me.sourceData;

        return new Promise ((resolve, reject) => {
            me.url = `${sourceData.workerConfig.protocol || ''}://${sourceData.workerConfig.host || ''}${sourceData.workerConfig.endpoint || ''}`;

            if (sourceData.connected === true) {
                me.enable().then(resolve).catch(reject);
            } else {
                resolve();
            }
        });
    }

    enable () {
        let me = this;
        let sourceData = me.sourceData;
        let socketClient = me.socketClient;

        return new Promise ((resolve, reject) => {
            if (sourceData.connected === true) {
                socketClient = SocketClient(me.url, { forceNew: true });

                socketClient.on('connect', () => {
                    console.log("Source " + sourceData.id + " connected to WS on " + me.url);
                    me.health = true;
                });

                socketClient.on('connect_error', (err) => {
                    console.log("Source " + sourceData.id + " error while connecting to WS on " + me.url + ' - ' + err);
                    me.health = true;
                });

                socketClient.on('disconnect', () => {
                    console.log("Source " + sourceData.id + " disconnected from WS on " + me.url);
                    me.health = false;
                });

                socketClient.on('event', function (data) {
                    me.notifyInputs(data);
                });
            }

            resolve();
        });
    }

    disable () {
        let me = this;

        return new Promise ((resolve, reject) => {
            if (me.socketClient) {
                me.socketClient.disconnect();
                me.socketClient = null;
                me.health = false;
            }

            resolve();
        });
    }
}

module.exports = WebSocketSource;
