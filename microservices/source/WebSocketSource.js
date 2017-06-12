const sourceConstants = require('../../server/microserviceManager/constants.json');

class WebSocketSource {

    constructor (sourceRecord) {
        let me = this;
        let logger = app.logger;

        me.sourceRecord = sourceRecord;
        me.isInRun = false;
        me.onNamespaceConnectionHandler = null;

        app.addListener(sourceConstants.SOURCE_PROCESS_PREFIX + me.sourceRecord.getId(), function (message) {
            me.commandListener(message);
        });
    }

    execute () {
        let me = this;
        let logger = app.logger;
        let userNamespace = app.wsUserNamespaces.get(me.sourceRecord.accountId);
        let SourceWorkerTypeModel = app.models.SourceWorkerType;
        let InputModel = app.models.Input;

        SourceWorkerTypeModel.findOne({ where: { type: me.sourceRecord.type }})
            .then(function (workerTypeRecord) {
                me.onNamespaceConnectionHandler = function (socket) {
                    socket.on(me.sourceRecord.workerConfig[workerTypeRecord.configFields[0].name], function (data) {
                        if (me.isInRun === true) {
                            InputModel.updateInputsValue(me.sourceRecord.inputIdList, data)
                                .catch((err) => { throw err });
                        }
                    });
                };

                userNamespace.on('connection', me.onNamespaceConnectionHandler);
            })
            .catch(function (err) {
                logger.error('Error while loading SourceWorkerType: ' + me.sourceRecord.type + ' - ' + err);
            });
    }

    commandListener (message) {
        let me = this;
        let processCommand = JSON.parse(message).command;

        switch (processCommand) {
            case sourceConstants.DELETE_PROCESS_COMMAND:
                me.remove();
                break;
            case sourceConstants.RUN_PROCESS_COMMAND:
                me.run();
                break;
            case sourceConstants.STOP_PROCESS_COMMAND:
                me.stop();
                break;
            case sourceConstants.UPDATE_PROCESS_COMMAND:
                me.update();
                break;
            default:
                me.logger.warn('Undefined Source process command: ' + processCommand);
                return;
        }
    }

    remove () {
        let me = this;
        let logger = app.logger;
        let userNamespace = app.wsUserNamespaces.get(me.sourceRecord.accountId);

        me.stop();

        userNamespace.removeListener('connection', me.onNamespaceConnectionHandler);
        app.removeAllListeners(sourceConstants.SOURCE_PROCESS_PREFIX + me.sourceRecord.getId());

        logger.info('Worker for Source: ' + me.sourceRecord.id + ' removed');

        delete this;
    }

    run () {
        let me = this;
        let logger = app.logger;

        me.isInRun = true;

        logger.info('Worker for Source: ' + me.sourceRecord.id + ' is in run');
    }

    stop () {
        let me = this;
        let logger = app.logger;

        me.isInRun = false;

        logger.info('Worker for Source: ' + me.sourceRecord.id + ' is in stop');
    }

    update () {
        let me = this;
        let logger = app.logger;
        let isWasRunning = me.isInRun;
        let userNamespace = app.wsUserNamespaces.get(me.sourceRecord.accountId);

        me.stop();

        me.sourceRecord.reload()
            .then(function (newSourceRecord) {
                me.sourceRecord = newSourceRecord;

                userNamespace.removeListener('connection', me.onNamespaceConnectionHandler);

                me.execute();

                if (isWasRunning === true) {
                    me.run();
                }

                logger.info('Worker for Source: ' + me.sourceRecord.id + ' was updated');
            })
            .catch(function (err) {
                logger.error('Error while updating worker for Source: ' + me.sourceRecord.id + ' - ' + err);
            })
    }
}

module.exports = WebSocketSource;
