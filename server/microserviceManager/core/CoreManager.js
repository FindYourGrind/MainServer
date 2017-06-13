const constants = require('../constants.json');

let MicroServiceManager = require('../MicroServiceManager');
let coreProcessIDPool = new Set();


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
}

module.exports = CoreManager;

