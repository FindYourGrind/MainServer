const SinkManager = require('../microServiceManager/sink/SinkManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', function () {
        (new SinkManager()).start()
            .then(() => {
                return app.models.Sink.find()
            })
            .then(function (sinkRecords) {
                if (sinkRecords.length > 0) {
                    sinkRecords.forEach(function (sinkRecord) {
                        SinkManager.create(sinkRecord).catch((err) => { throw err; });
                    });
                }
            })
            .catch((err) => {
                logger.error('Error while running Sink Process: ' + err);
            });
    });

    process.nextTick(cb);
};
