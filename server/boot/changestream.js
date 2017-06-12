let SourceManager = require('../source/SourceManager');

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

        app.models[modelName].find({ where: change.target ? { id : change.target } : change.where })
            .then(function (items) {
                items.forEach(function (item) {
                    logger.info(modelName + ': ' + item.getId() + ' updated. Notification by WebSocket started (' + change.type + ')');

                    app.wsInstance.emit(modelName.toLowerCase() + '-' + item.getId() + '-' + change.type, recordData);
                });
            })
            .catch(function () {
                logger.warn('Error in changeStream for ' + modelName);
            });
    }

    function microServicesPublisher (modelName, change) {
        let recordData = change.data;
        let canUpdate = true;
        let publishHandler;

        switch (modelName) {
            case Source.modelName:
                publishHandler = SourceManager.updateSourceProcess;
                break;
            default:
                canUpdate = false;
                break;
        }

        if (canUpdate) {
            app.models[modelName].find({where: change.target ? {id: change.target} : change.where})
                .then(function (items) {
                    items.forEach(function (item) {
                        logger.info(modelName + ': ' + item.getId() + ' updated. Notification Micro Services started (' + change.type + ')');

                        publishHandler(recordData);
                    });
                })
                .catch(function () {
                    logger.warn('Error in changeStream for ' + modelName);
                });
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
