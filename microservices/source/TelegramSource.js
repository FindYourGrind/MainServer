let Source = require('./Source');
let TelegramBot = require('node-telegram-bot-api');

let telegramInstanceMap = new Map();

class TelegramSource extends Source {

    static createTelegramInstance (token, command, idList) {
        let telegramInstance;

        if (telegramInstanceMap.has(token)) {
            let telegramInstanceObject = telegramInstanceMap.get(token);

            telegramInstanceObject.uses += 1;
            telegramInstance = telegramInstanceObject.instance;

            if (telegramInstanceObject.inputs.has(command)) {
                let commandInputs = telegramInstanceObject.inputs.get(command);

                idList.forEach((id) => {
                    commandInputs.add(id);
                });
            } else {
                telegramInstanceObject.inputs.set(command, new Set(idList));
            }
        } else {
            telegramInstance = new TelegramBot(token, { polling: true });
            telegramInstanceMap.set(token, {
                instance: telegramInstance,
                uses: 1,
                inputs: new Map().set(command, new Set(idList)),
                listeners: new Set(command)
            });
        }

        return telegramInstance;
    }

    static getTelegramInstanceObject (token) {
        let telegramInstanceObject = null;

        if (telegramInstanceMap.has(token)) {
            telegramInstanceObject = telegramInstanceMap.get(token);
        }

        return telegramInstanceObject;
    }

    static removeTelegramInstance (token, command, idList) {
        return new Promise ((resolve, reject) => {
            if (telegramInstanceMap.has(token)) {
                let telegramInstanceObject = telegramInstanceMap.get(token);

                if (telegramInstanceObject.uses > 1) {
                    telegramInstanceObject.uses -= 1;

                    if (telegramInstanceObject.inputs.has(command)) {
                        let commandInputs = telegramInstanceObject.inputs.get(command);

                        idList.forEach((id) => {
                            commandInputs.delete(id);
                        });
                    }

                    telegramInstanceObject.listeners.delete(command);

                    resolve();
                } else {
                    telegramInstanceObject.instance.stopPolling()
                        .then(() => {
                            telegramInstanceObject.instance = null;
                            telegramInstanceObject.uses = null;
                            telegramInstanceObject.inputs.clear();
                            telegramInstanceObject.inputs = null;
                            telegramInstanceObject.listeners.clear();
                            telegramInstanceObject.listeners = null;
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
    }

    init () {
        let me = this;
        let sourceData = me.sourceData;

        return new Promise ((resolve, reject) => {
            if (sourceData.workerConfig.token) {
                me.telegramBot = TelegramSource.createTelegramInstance(
                    sourceData.workerConfig.token,
                    sourceData.workerConfig.command,
                    sourceData.inputIdList);
            }

            me.enable().then(resolve).catch(reject);
        });
    }

    enable () {
        let me = this;

        return new Promise ((resolve, reject) => {
            if (me.sourceData.connected === true) {
                if (!TelegramSource.getTelegramInstanceObject(me.sourceData.workerConfig.token).listeners.has(me.sourceData.workerConfig.command)) {
                    me.telegramBot.onText(new RegExp(`\/${me.sourceData.workerConfig.command} (.*)`), (msg, match) => {
                        let telegramInstanceObject = TelegramSource.getTelegramInstanceObject(me.sourceData.workerConfig.token);

                        if (telegramInstanceObject) {
                            let inputsToNotify = telegramInstanceObject.inputs.get(me.sourceData.workerConfig.command);

                            TelegramSource.getTelegramInstanceObject(me.sourceData.workerConfig.token).instance.sendMessage(msg.from.id, 'Yes, Sir');
                            me.notifyCustomInputs(Array.from(inputsToNotify), match[1]);
                        }
                    });

                    TelegramSource.getTelegramInstanceObject(me.sourceData.workerConfig.token).listeners.add(me.sourceData.workerConfig.command);
                }

                me.health = true;
            }

            resolve();
        });
    }

    disable () {
        let me = this;

        return new Promise ((resolve, reject) => {
            me.health = false;

            TelegramSource.removeTelegramInstance(
                me.sourceData.workerConfig.token,
                me.sourceData.workerConfig.command,
                me.sourceData.inputIdList)
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