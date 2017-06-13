const SourceManager = require('../microServiceManager/source/SourceManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', function () {
        (new SourceManager()).start()
            .then(() => {
                return app.models.Source.find()
            })
            .then(function (sourceRecords) {
                if (sourceRecords.length > 0) {
                    sourceRecords.forEach(function (sourceRecord) {
                        SourceManager.create(sourceRecord).catch((err) => { throw err; });
                    });
                }
            })
            .catch((err) => {
                logger.error('Error while running Source Process: ' + err);
            });
    });

    process.nextTick(cb);
};
