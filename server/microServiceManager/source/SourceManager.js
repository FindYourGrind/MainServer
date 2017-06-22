const constants = require('../constants.json');

let MicroServiceManager = require('../MicroServiceManager');
let sourceProcessIDPool = new Set();


class SourceManager extends MicroServiceManager {

    constructor () {
        super(constants.source.ROLE, constants.source.PATH);

        let me = this;
        let app = MicroServiceManager.getApp();

        me.loggerInfoName = 'sourceMicroServiceInfo';
        me.loggerErrName = 'sourceMicroServiceErr';

        me.on(constants.source.commands.NOTIFY_INPUTS, (err, message) => {
            console.log(message);
            app.models.Input.updateInputsValue(message.inputs, message.data);
        });
    }

    static create (sourceRecord) {
        let sourceId = sourceRecord.getId();

        return new Promise((resolve, reject) => {
            if (!sourceProcessIDPool.has(sourceId)) {
                MicroServiceManager.act(constants.source.ROLE, constants.commands.CREATE, sourceRecord.__data, (err, result) => {
                    if (!err) {
                        sourceProcessIDPool.add(sourceId);
                        resolve(result);
                    } else {
                        reject('Error while creating Source Process: ' + sourceId + ' - ' + err);
                    }
                });
            } else {
                reject('Source Process with id: ' + sourceId + ' already created');
            }
        });
    }

    static remove (sourceRecordId) {
        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceRecordId)) {
                MicroServiceManager.act(constants.source.ROLE, constants.commands.REMOVE, {id: sourceRecordId}, (err, result) => {
                    if (!err) {
                        sourceProcessIDPool.delete(sourceRecordId);
                        resolve(result);
                    } else {
                        reject('Error while removing Source Process: ' + sourceRecordId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Source Process with id: ' + sourceRecordId);
            }
        });
    }

    static update (sourceRecord) {
        let sourceId = sourceRecord.getId();

        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceId)) {
                MicroServiceManager.act(constants.source.ROLE, constants.commands.UPDATE, sourceRecord.__data, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while updating Source Process: ' + sourceId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Source Process with id: ' + sourceId);
            }
        });
    }
}

module.exports = SourceManager;

