const constants = require('../constants.json');

let MicroServiceManager = require('../MicroServiceManager');
let coreProcessIDPool = new Set();
let inputProcessIDPool = new Set();
let outputProcessIDPool = new Set();


class CoreManager extends MicroServiceManager {

    constructor () {
        super(constants.core.ROLE, constants.core.PATH);

        let me = this;

        me.loggerInfoName = 'coreMicroServiceInfo';
        me.loggerErrName = 'coreMicroServiceErr';
    }

    static create (coreRecord) {
        let coreId = coreRecord.getId();

        return new Promise((resolve, reject) => {
            if (!coreProcessIDPool.has(coreId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.CREATE, coreRecord.__data, (err, result) => {
                    if (!err) {
                        coreProcessIDPool.add(coreId);
                        resolve(result);
                    } else {
                        reject('Error while creating Core Process: ' + coreId + ' - ' + err);
                    }
                });
            } else {
                reject('Core Process with id: ' + coreId + ' already created');
            }
        });
    }

    static remove (coreRecordId) {
        return new Promise((resolve, reject) => {
            if (coreProcessIDPool.has(coreRecordId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.REMOVE, { id: coreRecordId }, (err, result) => {
                    if (!err) {
                        coreProcessIDPool.delete(coreRecordId);
                        resolve(result);
                    } else {
                        reject('Error while removing Core Process: ' + coreRecordId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Sink Process with id: ' + coreRecordId);
            }
        });
    }

    static update (coreRecord) {
        let coreId = coreRecord.getId();

        return new Promise((resolve, reject) => {
            if (coreProcessIDPool.has(coreId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.UPDATE, coreRecord.__data, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while updating Core Process: ' + coreId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Core Process with id: ' + coreId);
            }
        });
    }

    static createInput (inputRecord) {
        let inputId = inputRecord.getId();

        return new Promise((resolve, reject) => {
            if (!inputProcessIDPool.has(inputId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.CREATE_INPUT, inputRecord.__data, (err, result) => {
                    if (!err) {
                        inputProcessIDPool.add(inputId);
                        resolve(result);
                    } else {
                        reject('Error while creating Input: ' + inputId + ' - ' + err);
                    }
                });
            } else {
                reject('Input with id: ' + inputId + ' already created');
            }
        });
    }

    static removeInput (inputId) {
        return new Promise((resolve, reject) => {
            if (inputProcessIDPool.has(inputId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.REMOVE_INPUT, { id: inputId }, (err, result) => {
                    if (!err) {
                        inputProcessIDPool.delete(inputId);
                        resolve(result);
                    } else {
                        reject('Error while removing Input Process: ' + inputId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Input with id: ' + inputId);
            }
        });
    }

    static updateInput (inputRecord) {
        let inputId = inputRecord.getId();

        return new Promise((resolve, reject) => {
            if (inputProcessIDPool.has(inputId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.UPDATE_INPUT, inputRecord.__data, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while updating Input: ' + inputId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Input with id: ' + inputId);
            }
        });
    }

    static createOutput (outputRecord) {
        let outputId = outputRecord.getId();

        return new Promise((resolve, reject) => {
            if (!outputProcessIDPool.has(outputId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.CREATE_OUTPUT, outputRecord.__data, (err, result) => {
                    if (!err) {
                        outputProcessIDPool.add(outputId);
                        resolve(result);
                    } else {
                        reject('Error while creating Output: ' + outputId + ' - ' + err);
                    }
                });
            } else {
                reject('Output with id: ' + outputId + ' already created');
            }
        });
    }

    static removeOutput (outputId) {
        return new Promise((resolve, reject) => {
            if (outputProcessIDPool.has(outputId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.REMOVE_OUTPUT, { id: outputId }, (err, result) => {
                    if (!err) {
                        outputProcessIDPool.delete(outputId);
                        resolve(result);
                    } else {
                        reject('Error while removing Output Process: ' + outputId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Output with id: ' + outputId);
            }
        });
    }

    static updateOutput (outputRecord) {
        let outputId = outputRecord.getId();

        return new Promise((resolve, reject) => {
            if (outputProcessIDPool.has(outputId)) {
                MicroServiceManager.act(constants.core.ROLE, constants.commands.UPDATE_OUTPUT, outputRecord.__data, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while updating Output: ' + outputId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Output with id: ' + outputId);
            }
        });
    }
}

module.exports = CoreManager;

