let es = require('event-stream');

module.exports = function(app) {
    app.on('wsReady', function () {
        let logger = app.logger;
        let Source = app.models.Source;
        let Input = app.models.Input;

        Source.createChangeStream(function (err, changes) {
            //changes.pipe(es.stringify()).pipe(process.stdout);
            changes.on('data', function (change) {
                let sourceIds = Number.isInteger(change.target) ? change.target : change.target.inq;
                let sourceData = change.data;

                [].concat(sourceIds).forEach(function (sourceId) {
                    logger.info('Source: ' + sourceId + ' updated. Notification started (' + change.type + ')');

                    app.wsInstance.emit('source-' + sourceId + '-' + change.type, sourceData);
                });
            });
        });

        Input.createChangeStream(function (err, changes) {
            //changes.pipe(es.stringify()).pipe(process.stdout);
            changes.on('data', function (change) {
                let inputIds = Number.isInteger(change.target) ? change.target : change.target.inq;
                let inputData = change.data;

                [].concat(inputIds).forEach(function (inputId) {
                    logger.info('Input: ' + inputId + ' updated. Notification started (' + change.type + ')');

                    app.wsInstance.emit('input-' + inputId + '-' + change.type, inputData);
                });
            });
        });
    });
};
