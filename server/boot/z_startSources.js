const SourceManager = require('../source/SourceManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', function () {
        let sourceModel = app.models.Source;

        sourceModel.find()
            .then(function (sourceRecords) {
                sourceRecords.forEach(function (sourceRecord) {
                    SourceManager.createSourceProcess(sourceRecord);

                    if (sourceRecord.connected === true) {
                        SourceManager.runSourceProcess(sourceRecord.getId());
                    }
                });
            })
            .catch(function () {
                logger.error('Error while queueing Source Records');
            });

    });

    process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};