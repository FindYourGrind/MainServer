let TelegramBot = require('./TelegramBot');

let telegramBotMap = new Map();

class TelegramBotManager {

    static createTelegramBot (sourceData, onMessage) {
        let telegramBot;
        let token = sourceData.workerConfig.token;
        let inputs = sourceData.inputIdList;

        if (telegramBotMap.has(token)) {
            telegramBot = telegramBotMap.get(token);
            telegramBot.addUse();
        } else {
            telegramBot = new TelegramBot(token);
            telegramBotMap.set(token, telegramBot);
            telegramBot.getInstance().on('message', onMessage);
        }

        telegramBot.setCommand(sourceData.workerConfig.command, sourceData.id, sourceData.connected);
        telegramBot.setInputs(sourceData.workerConfig.command, sourceData.id, inputs);

        return telegramBot;
    }

    static getTelegramBot (sourceData) {
        let telegramBot = null;
        let token = sourceData.workerConfig.token;

        if (telegramBotMap.has(token)) {
            telegramBot = telegramBotMap.get(token);
        }

        return telegramBot;
    }

    static removeTelegramBot (sourceData) {
        let token = sourceData.workerConfig.token;
        let command = sourceData.workerConfig.command;

        return new Promise ((resolve, reject) => {
            if (telegramBotMap.has(token)) {
                let telegramBot = telegramBotMap.get(token);

                telegramBot.removeUse();
                telegramBot.removeInputs(command, sourceData.id);

                console.log(telegramBot.getUses());

                if (telegramBot.getUses() === 0) {
                    console.log('stop polling');
                    telegramBot.getInstance().stopPolling()
                        .then(() => {
                            telegramBot = null;
                            telegramBotMap.delete(token);
                            resolve();
                        })
                        .catch(reject);
                } else if (telegramBot.getInputs(command).size === 0) {
                    telegramBot.removeCommand(command);
                    resolve();
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }
}

module.exports = TelegramBotManager;
