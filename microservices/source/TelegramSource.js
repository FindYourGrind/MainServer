let Source = require('./Source');
let TelegramBot = require('node-telegram-bot-api');

let telegramInstanceMap = new Map();

class TelegramSource extends Source {

    static getTelegramInstance (token) {
        let telegramInstance;

        if (telegramInstanceMap.has(token)) {
            let telegramInstanceObject = telegramInstanceMap.get(token);

            telegramInstanceObject.uses += 1;
            telegramInstance = telegramInstanceObject.instance;
        } else {
            telegramInstance = new TelegramBot(token, { polling: true });
            telegramInstanceMap.set(token, { instance: telegramInstance, uses: 1 });
        }

        return telegramInstance;
    }

    static removeTelegramInstance (token) {
        return new Promise ((resolve, reject) => {
            if (telegramInstanceMap.has(token)) {
                let telegramInstanceObject = telegramInstanceMap.get(token);

                if (telegramInstanceObject.uses > 1) {
                    telegramInstanceObject.uses -= 1;

                    resolve();
                } else {
                    telegramInstanceObject.instance.stopPolling()
                        .then(() => {
                            telegramInstanceObject.instance = null;
                            telegramInstanceObject.uses = null;
                            telegramInstanceObject = null;
                            telegramInstanceMap.delete(token);

                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            }

            resolve();
        });
    }

    constructor () {
        super(...arguments);

        this.telegramBot = null;
        this.messageHandler = null;
    }

    init () {
        let me = this;
        let sourceData = me.sourceData;

        return new Promise ((resolve, reject) => {
            if (sourceData.workerConfig.token) {
                me.telegramBot = TelegramSource.getTelegramInstance(sourceData.workerConfig.token);
            }

            me.enable().then(resolve).catch(reject);
        });
    }

    enable () {
        let me = this;
        let sourceData = me.sourceData;

        return new Promise ((resolve, reject) => {
            if (sourceData.connected === true) {
                me.messageHandler = function (msg, match) {
                    me.telegramBot.sendMessage(msg.from.id, 'Yes, Sir');
                    me.notifyInputs(match[1]);
                };


                me.telegramBot.onText(new RegExp(`\/${sourceData.workerConfig.command} (.*)`), me.messageHandler);
                me.telegramBot.onText(new RegExp(`\/${sourceData.workerConfig.command} (.*)`), null);

                me.health = true;
            }

            resolve();
        });
    }

    disable () {
        let me = this;

        return new Promise ((resolve, reject) => {
            me.messageHandler = null;
            me.health = false;

            TelegramSource.removeTelegramInstance(me.sourceData.workerConfig.token)
                .then(() => {
                    me.telegramBot = null;

                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = TelegramSource;