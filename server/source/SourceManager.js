const sourceConstants = require('./constants.json');

let fork = require('child_process').fork;
let app = require('../server');
let sourceProcessIDPool = new Set();

const SOURCE_FACTORY_ROLE = 'sourceFactory';


function actSeneca (role, command, data, callback) {
    let logger = app.logger;

    app.seneca.act({
            role: role,
            cmd: command,
            data: data
        },
        (err, result) => {
            err ?
                logger.senecaError('Error while doing command: [' + command + '] on role: [' + role + ']: ' + err) :
                logger.senecaInfo('Result for command: [' + command + '] on role: [' + role + ']: ' + JSON.stringify(result));

            if (callback) {
                callback(err, result);
            }
        });
}

class SourceManager {

    static startMicroService () {
        let logger = app.logger;
        let sourceMicroServiceProcess = fork('microservices/source/SenecaSource.js', [], {
            //execArgv: ['--debug-brk=44444', '--expose_debug_as=v8debug'],
            stdio: [ 'pipe', 'pipe', 'pipe', 'ipc']
        });

        sourceMicroServiceProcess.stdout.on('data', (logData) => {
            logger.sourceMicroService(logData.toString());
        });
        sourceMicroServiceProcess.stderr.on('data', (logErrData) => {
            logger.sourceMicroServiceErr(logErrData.toString());
        });

        process.on('exit', () => {
            sourceMicroServiceProcess.kill();
        });
    }

    static onReady (callback) {
        app.seneca.use(() => {
            app.seneca.add({role: SOURCE_FACTORY_ROLE, cmd: 'ready'}, callback);
        });
    }

    static createSourceProcess (sourceRecord) {
        let sourceId = sourceRecord.getId();

        return new Promise((resolve, reject) => {
            if (!sourceProcessIDPool.has(sourceId)) {
                actSeneca(SOURCE_FACTORY_ROLE, 'create', sourceRecord.__data, (err, result) => {
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

    static deleteSourceProcess (sourceRecordId) {
        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceRecordId)) {
                actSeneca(SOURCE_FACTORY_ROLE, 'delete', {id: sourceRecordId}, (err, result) => {
                    if (!err) {
                        sourceProcessIDPool.delete(sourceRecordId);
                        resolve(result);
                    } else {
                        reject('Error while deleting Source Process: ' + sourceRecordId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Source Process with id: ' + sourceRecordId);
            }
        });
    }

    static runSourceProcess (sourceRecordId) {
        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceRecordId)) {
                actSeneca(SOURCE_FACTORY_ROLE, 'run', {id: sourceRecordId}, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while running Source Process: ' + sourceRecordId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Source Process with id: ' + sourceRecordId);
            }
        });
    }

    static stopSourceProcess (sourceRecordId) {
        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceRecordId)) {
                actSeneca(SOURCE_FACTORY_ROLE, 'stop', {id: sourceRecordId}, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while stopping Source Process: ' + sourceRecordId + ' - ' + err);
                    }
                });
            } else {
                reject('No such Source Process with id: ' + sourceRecordId);
            }
        });
    }

    static updateSourceProcess (sourceRecord) {
        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceRecord.id)) {
                actSeneca(SOURCE_FACTORY_ROLE, 'update', sourceRecord, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject('Error while updating Source Process: ' + sourceRecord.id + ' - ' + err);
                    }
                });
            } else {
                reject('No such Source Process with id: ' + sourceRecord.id);
            }
        });
    }
}

module.exports = SourceManager;
