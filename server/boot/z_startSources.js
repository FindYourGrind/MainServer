const SourceManager = require('../microserviceManager/source/SourceManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', function () {
        SourceManager.onReady((message, callback) => {
            if (!message.err) {
                let sourceModel = app.models.Source;

                sourceModel.find()
                    .then(function (sourceRecords) {
                        if (sourceRecords.length > 0) {
                            sourceRecords.forEach(function (sourceRecord) {
                                SourceManager.createSourceProcess(sourceRecord)
                                    .then(() => {
                                        callback();
                                    })
                                    .catch((err) => {
                                        throw err;
                                    });
                            });
                        } else {
                            callback();
                        }
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
