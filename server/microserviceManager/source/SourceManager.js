const sourceConstants = require('../constants.json');

let fork = require('child_process').fork;
let app = require('../../server');
let sourceProcessIDPool = new Set();


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
            execArgv: ['--inspect'],
            //execArgv: process.execArgv,
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
            app.seneca.add({role: sourceConstants.source.ROLE, cmd: sourceConstants.commands.READY}, callback);
        });
    }

    static createSourceProcess (sourceRecord) {
        let sourceId = sourceRecord.getId();

        return new Promise((resolve, reject) => {
            if (!sourceProcessIDPool.has(sourceId)) {
                actSeneca(sourceConstants.source.ROLE, sourceConstants.commands.CREATE, sourceRecord.__data, (err, result) => {
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

    static removeSourceProcess (sourceRecordId) {
        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceRecordId)) {
                actSeneca(sourceConstants.source.ROLE, sourceConstants.commands.REMOVE, {id: sourceRecordId}, (err, result) => {
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

    static updateSourceProcess (sourceRecord) {
        let sourceId = sourceRecord.getId();

        return new Promise((resolve, reject) => {
            if (sourceProcessIDPool.has(sourceId)) {
                actSeneca(sourceConstants.source.ROLE, sourceConstants.commands.UPDATE, sourceRecord.__data, (err, result) => {
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
