const SourceManager = require('../source/SourceManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', function () {
        SourceManager.onReady((message, callback) => {
            if (!message.err) {
                let sourceModel = app.models.Source;

                sourceModel.find()
                    .then(function (sourceRecords) {
                        sourceRecords.forEach(function (sourceRecord) {
                            SourceManager.createSourceProcess(sourceRecord)
                                .then(() => {
                                    if (sourceRecord.connected === true) {
                                        return SourceManager.runSourceProcess(sourceRecord.getId());
                                    }
                                })
                                .then(() => { callback(); })
                                .catch((err) => { throw err; });
                        });
                    })
                    .catch(function (err) {
                        logger.error('Error while queueing Source Records: ' + err);
                        callback(err);
                    });
            } else {
                logger.error('Error while starting Source Micro Service: ' + message.err);
            }
        });
        SourceManager.startMicroService();
    });

    process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
