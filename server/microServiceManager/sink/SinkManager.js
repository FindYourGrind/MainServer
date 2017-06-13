const constants = require('../constants.json');

let MicroServiceManager = require('../MicroServiceManager');
let sinkProcessIDPool = new Set();


class SinkManager extends MicroServiceManager {

    constructor () {
        super(constants.sink.ROLE, constants.sink.PATH);

        let me = this;

        me.loggerInfoName = 'sinkMicroServiceInfo';
        me.loggerErrName = 'sinkMicroServiceErr';
    }

    static create (sinkRecord) {
        let sinkId = sinkRecord.getId();

        return new Promise((resolve, reject) => {
            if (!sinkProcessIDPool.has(sinkId)) {
                MicroServiceManager.act(constants.sink.ROLE, constants.commands.CREATE, sinkRecord.__data, (err, result) => {
                    if (!err) {
                        sinkProcessIDPool.add(sinkId);
                        resolve(result);
                    } else {
                        reject('Error while creating Sink Process: ' + sinkId + ' - ' + err);
                    }
                });
            } else {
                reject('Sink Process with id: ' + sinkId + ' already created');
            }
        });
    }

    static remove (sinkRecordId) {
        return new Promise((resolve, reject) => {
            if (sinkProcessIDPool.has(sinkRecordId)) {
                MicroServiceManager.act(constants.sink.ROLE, constants.commands.REMOVE, {id: sinkRecordId}, (err, result) => {
                    if (!err) {
                        sinkProcessIDPool.delete(sinkRecordId);
                        resolve(result);
                    } else {
                        reject('Error while removing Sink Process: ' + sinkRecordId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Sink Process with id: ' + sinkRecordId);
            }
        });
    }

    static update (sinkRecord) {
        let sinkId = sinkRecord.getId();

        return new Promise((resolve, reject) => {
            if (sinkProcessIDPool.has(sinkId)) {
                MicroServiceManager.act(constants.sink.ROLE, constants.commands.UPDATE, sinkRecord.__data, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while updating Sink Process: ' + sinkId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Sink Process with id: ' + sinkId);
            }
        });
    }
}

module.exports = SinkManager;

