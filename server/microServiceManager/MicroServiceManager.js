const constants = require('./constants.json');

let fork = require('child_process').fork;
let app = require('../server');


class MicroServiceManager {

    constructor (role, path) {
        let me = this;

        me.pid = -1;
        me.role = role;
        me.path = path;
        me.loggerInfoName = 'microServiceInfo';
        me.loggerErrName = 'microServiceErr';
    }

    static act (role, command, data, callback) {
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

    start () {
        let me = this;

        return new Promise((resolve, reject) => {
            if (me.pid === -1) {
                let logger = app.logger;
                let sourceMicroServiceProcess = fork(me.path, [], {
                    //execArgv: ['--inspect'],
                    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
                });

                me.pid = sourceMicroServiceProcess.pid;

                sourceMicroServiceProcess.stdout.on('data', (logData) => {
                    if(logger[me.loggerInfoName]) {
                        logger[me.loggerInfoName](logData.toString());
                    }
                });

                sourceMicroServiceProcess.stderr.on('data', (logErrData) => {
                    if(logger[me.loggerErrName]) {
                        logger[me.loggerErrName](logErrData.toString());
                    }
                });

                process.on('exit', () => {
                    sourceMicroServiceProcess.kill(me.pid);
                });

                app.seneca.use(() => {
                    app.seneca.add({role: me.role, cmd: constants.commands.READY}, function (message, callback) {
                        if (!message.err) {
                            resolve(message);
                            callback();
                        } else {
                            reject(message.err);
                        }
                    });
                });
            } else {
                reject('Process has been started already');
            }
        });
    }

    stop () {
        let me = this;

        if (me.pid > 0) {
            process.kill(me.pid);
            me.pid = -1;
        }
    }
}

module.exports = MicroServiceManager;
