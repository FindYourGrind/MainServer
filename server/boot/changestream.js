let es = require('event-stream');

module.exports = function(app) {
    let logger = app.logger;
    let Source = app.models.Source;
    let Input = app.models.Input;
    let Output = app.models.Output;
    let Sink = app.models.Sink;
    let Core = app.models.Core;

    function notificationHandler (modelName, changesStream) {
        //changes.pipe(es.stringify()).pipe(process.stdout);
        changesStream.on('data', function (change) {
            let recordsIds = Number.isInteger(change.target) ? change.target : change.target.inq;
            let recordData = change.data;

            [].concat(recordsIds).forEach(function (recordId) {
                logger.info(modelName + ': ' + recordId + ' updated. Notification started (' + change.type + ')');

                app.wsInstance.emit(modelName.toLowerCase() + '-' + recordId + '-' + change.type, recordData);
            });
        });
    }

    app.on('wsReady', function () {
        Source.createChangeStream(function (err, changes) {
            if (!err) {
                notificationHandler('Source', changes)
            }
        });

        Input.createChangeStream(function (err, changes) {
            if (!err) {
                notificationHandler('Input', changes)
            }
        });

        Output.createChangeStream(function (err, changes) {
            if (!err) {
                notificationHandler('Output', changes)
            }
        });

        Sink.createChangeStream(function (err, changes) {
            if (!err) {
                notificationHandler('Sink', changes)
            }
        });

        // Core.createChangeStream(function (err, changes) {
        //     if (!err) {
        //         notificationHandler('Core', changes)
        //     }
        // });
    });
};
