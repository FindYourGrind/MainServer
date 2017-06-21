let Source = require('./Source');
let TelegramBotManager = require('./telegram_bot/TelegramBotManager');

function onMessageHandler (message) {
    let telegramSource = this;
    let sourceData = telegramSource.sourceData;
    let telegramBot = TelegramBotManager.getTelegramBot(sourceData);

    if (telegramBot) {
        let telegramBotInstance = telegramBot.getInstance();

        telegramBot.commands.forEach((connectedIdMap, command) => {
            let commandMatch = new RegExp(`\/${command} (.*)`).exec(message.text);

            if (commandMatch) {
                let inputsIdMap = telegramBot.inputs.get(command);

                telegramBotInstance.sendMessage(message.from.id, 'Yes, Sir');

                inputsIdMap.forEach((inputs, id) => {
                    if (connectedIdMap.get(id) === true) {
                        telegramSource.notifyCustomInputs(inputs, commandMatch[1]);
                    }
                });
            }
        });
    }
}

class TelegramSource extends Source {

    init () {
        let me = this;
        let sourceData = me.sourceData;

        return new Promise ((resolve, reject) => {
            if (sourceData.workerConfig.token) {
                TelegramBotManager.createTelegramBot(sourceData, onMessageHandler.bind(me));
                resolve();
            } else {
                reject('No telegram bot token: Source Name: ' + sourceData.name);
            }
        });
    }

    disable () {
        return TelegramBotManager.removeTelegramBot(this.sourceData);
    }
}

module.exports = TelegramSource;
