let SourceManager = require('../microServiceManager/source/SourceManager');
let SinkManager = require('../microServiceManager/sink/SinkManager');
let CoreManager = require('../microServiceManager/core/CoreManager');

module.exports = function(app) {
    let logger = app.logger;
    let Source = app.models.Source;
    let Input = app.models.Input;
    let Output = app.models.Output;
    let Sink = app.models.Sink;
    let Core = app.models.Core;
    let Workspace = app.models.Workspace;

    function webSocketPublisher (modelName, change) {
        let recordData = change.data;

        app.wsInstance.emit('models-global-update');

        if (change.type !== 'remove') {
            app.models[modelName].find({where: change.target ? {id: change.target} : change.where})
                .then(function (items) {
                    items.forEach(function (item) {
                        logger.info(modelName + ': ' + item.getId() + ' updated. Notification by WebSocket started (' + change.type + ')');

                        app.wsInstance.emit(modelName.toLowerCase() + '-' + item.getId() + '-' + change.type, recordData);
                    });
                })
                .catch(function () {
                    logger.warn('Error in changeStream for ' + modelName);
                });
        } else {
            logger.info(modelName + ': ' + change.target + ' updated. Notification by WebSocket started (' + change.type + ')');

            app.wsInstance.emit(modelName.toLowerCase() + '-' + change.target + '-' + change.type);
        }
    }

    function microServicesPublisher (modelName, change) {
        let recordData = change.data;
        let canUpdate = true;
        let publishHandler;

        switch (modelName) {
            case Source.modelName:
                switch (change.type) {
                    case 'create':
                        publishHandler = SourceManager.create;
                        break;
                    case 'update':
                        publishHandler = SourceManager.update;
                        break;
                    case 'remove':
                        publishHandler = SourceManager.remove;
                        break;
                    default:
                        canUpdate = false;
                }
                break;
            case Sink.modelName:
                switch (change.type) {
                    case 'create':
                        publishHandler = SinkManager.create;
                        break;
                    case 'update':
                        publishHandler = SinkManager.update;
                        break;
                    case 'remove':
                        publishHandler = SinkManager.remove;
                        break;
                    default:
                        canUpdate = false;
                }
                break;
            case Core.modelName:
                switch (change.type) {
                    case 'create':
                        publishHandler = CoreManager.create;
                        break;
                    case 'update':
                        publishHandler = CoreManager.update;
                        break;
                    case 'remove':
                        publishHandler = CoreManager.remove;
                        break;
                    default:
                        canUpdate = false;
                }
                break;
            case Input.modelName:
                switch (change.type) {
                    case 'create':
                        publishHandler = CoreManager.createInput;
                        break;
                    case 'update':
                        publishHandler = CoreManager.updateInput;
                        break;
                    case 'remove':
                        publishHandler = CoreManager.removeInput;
                        break;
                    default:
                        canUpdate = false;
                }
                break;
            case Output.modelName:
                switch (change.type) {
                    case 'create':
                        publishHandler = CoreManager.createOutput;
                        break;
                    case 'update':
                        publishHandler = CoreManager.updateOutput;
                        break;
                    case 'remove':
                        publishHandler = CoreManager.removeOutput;
                        break;
                    default:
                        canUpdate = false;
                }
                break;
            default:
                canUpdate = false;
                break;
        }

        if (canUpdate) {
            if (change.type !== 'remove') {
                app.models[modelName].find({where: change.target ? {id: change.target} : change.where})
                    .then(function (items) {
                        items.forEach(function (item) {
                            logger.info(modelName + ': ' + item.getId() + ' updated. Notification Micro Services started (' + change.type + ')');

                            publishHandler(item).catch((err) => { throw err; });
                        });
                    })
                    .catch(function (err) {
                        logger.error('Error in changeStream for ' + modelName + ' - ' + err);
                    });
            } else {
                logger.info(modelName + ': ' + change.target + ' deleted. Notification Micro Services started (' + change.type + ')');

                publishHandler(change.target)
                    .catch((err) => {
                        logger.error('Error while processing ' + modelName + ' micro service: - ' + err);
                    });
            }
        }
    }

    function notificationHandler (modelName, changeStream) {
        changeStream.on('data', (change) => {
            webSocketPublisher(modelName, change);
            microServicesPublisher(modelName, change);
        });

    }

    function changeStreamHandler (err, change) {
        let modelName = this.modelName;

        if (!err) {
            notificationHandler(modelName, change)
        } else {
            logger.warn('Error while creating Change Stream for ' + modelName + ': ' + err);
        }
    }

    app.on('wsReady', function () {
        Source.createChangeStream(changeStreamHandler.bind(Source));
        Input.createChangeStream(changeStreamHandler.bind(Input));
        Output.createChangeStream(changeStreamHandler.bind(Output));
        Sink.createChangeStream(changeStreamHandler.bind(Sink));
        Core.createChangeStream(changeStreamHandler.bind(Core));
        Workspace.createChangeStream(changeStreamHandler.bind(Workspace));
    });
};
