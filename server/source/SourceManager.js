const sourceConstants = require('./constants.json');

let app = require('../server');
let logger = app.logger;
let sourceProcessIDPool = new Set();

const SOURCE_FACTORY_ROLE = 'sourceFactory';


function actSeneca (role, command, data, callback) {
    app.seneca.act({
            role: role,
            cmd: command,
            data: data
        },
        (err, result) => {
            logger.senecaError(err !== null ?
                'Error while doing command: [' + command + '] on role: [' + role + ']: ' + err :
                'Result for command: [' + command + '] on role: [' + role + ']: ' + result);

            if (callback) {
                callback(err, result);
            }
        });
}

class SourceManager {

    static createSourceProcess (sourceRecord) {
        let sourceId = sourceRecord.getId();

        if (!sourceProcessIDPool.has(sourceId)) {
            actSeneca(SOURCE_FACTORY_ROLE, 'create', sourceRecord.__data, (err) => {
                if (!err) {
                    sourceProcessIDPool.add(sourceId);
                }
            });
        }
    }

    static deleteSourceProcess (sourceRecordId) {
        if (!sourceProcessIDPool.has(sourceRecordId)) {
            actSeneca(SOURCE_FACTORY_ROLE, 'delete', { id: sourceRecordId }, (err) => {
                if (!err) {
                    sourceProcessIDPool.delete(sourceRecordId);
                }
            });
        }
    }

    static runSourceProcess (sourceRecordId) {
        if (!sourceProcessIDPool.has(sourceRecordId)) {
            actSeneca(SOURCE_FACTORY_ROLE, 'run', { id: sourceRecordId });
        }
    }

    static stopSourceProcess (sourceRecordId) {
        if (!sourceProcessIDPool.has(sourceRecordId)) {
            actSeneca(SOURCE_FACTORY_ROLE, 'stop', { id: sourceRecordId });
        }
    }

    static updateSourceProcess (sourceRecordId) {
        if (!sourceProcessIDPool.has(sourceRecordId)) {
            actSeneca(SOURCE_FACTORY_ROLE, 'update', { id: sourceRecordId });
        }
    }
}

module.exports = SourceManager;
