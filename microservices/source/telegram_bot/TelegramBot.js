let Bot = require('node-telegram-bot-api');

class TelegramBot {
    constructor (token) {
        this.instance = new Bot(token, { polling: true });
        this.uses = 1;
        this.commands = new Map();
        this.inputs = new Map();
    }

    getInstance () { return this.instance; }

    addUse () { this.uses += 1; }

    removeUse () { this.uses -= 1; }

    getUses () { return this.uses }

    setCommand (command, id, connected) {
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

    setInputs (command, id, inputs) {
        if (this.inputs.has(command)) {
            this.inputs.get(command).set(id, inputs);
        } else {
            this.inputs.set(command, new Map().set(id, inputs));
        }
    }

    removeInputs (command, id) {
        if (this.inputs.has(command)) {
            this.inputs.get(command).delete(id);
        }
    }

    getInputs (command) {
        let result = null;

        if (this.inputs.has(command)) {
            result = this.inputs.get(command);
        }

        return result;
    }
}

module.exports = TelegramBot;