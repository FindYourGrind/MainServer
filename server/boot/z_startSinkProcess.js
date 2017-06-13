const SinkManager = require('../microServiceManager/sink/SinkManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', () => {
        (new SinkManager()).start()
            .then(() => {
                return app.models.Sink.find()
            })
            .then((sinkRecords) => {
                if (sinkRecords.length > 0) {
                    return app.utility.promiseConveyor(function (resolve, reject) {
                        sinkRecords.forEach((sinkRecord) => {
                            SinkManager.create(sinkRecord).then(resolve).catch(reject);
                        });
                    });
                }
            })
            .catch((err) => {
                logger.error('Error while running Sink Process Manager: ' + err);
            });
    });

    process.nextTick(cb);
};
