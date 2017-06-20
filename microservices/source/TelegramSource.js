let Source = require('./Source');
let TelegramBot = require('node-telegram-bot-api');

let telegramSourceBotMap = new Map();

class TelegramSourceBot {
    constructor (token) {
        this.instance = new TelegramBot(token, { polling: true });
        this.uses = 0;
        this.commands = new Map();
        this.inputsForCommand = new Map();
    }

    getInstance () { return this.instance; }

    addUse () { this.use += 1; }

    removeUse () { this.use -= 1; }

    getUses () { return this.uses }

    addCommand (command, id, connected) {
        if (this.commands.has(command)) {
            this.commands.get(command).set(id, connected);
        } else {
            this.commands.set(command, new Map().set(id, connected))
        }
    }

    removeCommand (command, id) {
        if (this.commands.has(command)) {
            let idMap = this.commands.get(command);
            idMap.delete(id);

            if (idMap.size === 0) {
                this.commands.delete(command);
            }
        }
    }

    getCommand (command) { return this.commands.get(command); }

    hasCommand (command) { return this.commands.has(command); }

    addInputs (command, inputs) {
        if (this.inputsForCommand.has(command)) {
            inputs.forEach((input) => {
                this.inputsForCommand.get(command).add(input);
            });
        } else {
            this.inputsForCommand.set(command, new Set(inputs));
        }
    }

    removeInputs (command, inputs) {
        if (this.inputsForCommand.has(command)) {
            inputs.forEach((input) => {
                this.inputsForCommand.get(command).delete(input);
            });
        }
    }

    getInputs (command) {
        let result = null;

        if (this.inputsForCommand.has(command)) {
            result = Array.from(this.inputsForCommand.get(command));
        }

        return result;
    }
}

class TelegramSource extends Source {

    static getTelegramSourceBot (sourceData, onMessage) {
        let telegramSourceBot;
        let token = sourceData.workerConfig.token;
        let inputs = sourceData.inputIdList;

        if (telegramSourceBotMap.has(token)) {
            telegramSourceBot = telegramSourceBotMap.get(token);
            telegramSourceBot.addUse();
            telegramSourceBot.addInputs(sourceData.workerConfig.command, inputs);
        } else {
            telegramSourceBot = new TelegramSourceBot(token);
            telegramSourceBotMap.set(token, telegramSourceBot);
            telegramSourceBot.addUse();
            telegramSourceBot.addInputs(sourceData.workerConfig.command, inputs);
            telegramSourceBot.on('message', onMessage);
        }

        return telegramSourceBot;
    }

    static updateTelegramSourceBot (newSourceData, oldSourceData) {}

    static removeTelegramSourceBot (sourceData) {
        let telegramSourceBot;
        let token = sourceData.workerConfig.token;
        let command = sourceData.workerConfig.command;
        let inputs = sourceData.inputIdList;

        return new Promise ((resolve, reject) => {
            if (telegramSourceBotMap.has(token)) {
                telegramSourceBot = telegramSourceBotMap.get(token);
                telegramSourceBot.removeUse();
                telegramSourceBot.removeInputs(command, inputs);

                if (telegramSourceBot.getUses() === 0) {
                    telegramSourceBot.getInstance().stopPolling()
                        .then(() => {
                            telegramSourceBot = null;
                            telegramSourceBotMap.delete(token);
                            resolve();
                        })
                        .catch(reject);
                } else if (telegramSourceBot.getInputs(command).length === 0) {
                    telegramSourceBot.removeCommand(command);
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    init () {
        let me = this;
        let sourceData = me.sourceData;

        return new Promise ((resolve, reject) => {
            if (sourceData.workerConfig.token) {
                TelegramSource.getTelegramSourceBot(sourceData, (message) => {
                    if (sourceData.connected === true) {
                        let cmdReg = new RegExp(`\/${command} (.*)`);

                    }
                });
                me.enable().then(resolve).catch(reject);
            } else {
                resolve();
            }
        });
    }

    enable () {
        let me = this;
        let sourceData = me.sourceData;
        let command = sourceData.workerConfig.command;
        let telegramSourceBot = TelegramSource.getTelegramSourceBot(sourceData);

        return new Promise ((resolve, reject) => {
            if (sourceData.connected === true && telegramSourceBot) {
                if (!telegramSourceBot.hasCommand(command)) {
                    let telegramBotInstance = telegramSourceBot.getInstance();

                    //telegramBotInstance.on(new RegExp(`\/${command} (.*)`), (message, match) => {
                    telegramBotInstance.on('message', (message) => {


                        if (telegramSourceBot && telegramBotInstance) {
                            let inputs = telegramSourceBot.getInputs(me.sourceData.workerConfig.command);

                            telegramBotInstance.sendMessage(message.from.id, 'Yes, Sir');
                            me.notifyCustomInputs(inputs, match[1]);
                        }
                    });

                    telegramBotInstance.on('message', (msg) => {
                        console.log(msg.text);
                    });

                    telegramSourceBot.addCommand(command);
                }
            }

            resolve();
        });
    }

    disable () {
        return TelegramSource.removeTelegramSourceBot(this.sourceData);
    }

    update (sourceData) {
        let me = this;

        return me.disable()
            .then(() => {
                TelegramSource.updateTelegramSourceBot(sourceData, me.sourceData);
                me.sourceData = sourceData;
                return me.init();
            });
    }
}

module.exports = TelegramSource;
