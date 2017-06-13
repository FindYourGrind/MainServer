const SourceManager = require('../microServiceManager/source/SourceManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', () => {
        (new SourceManager()).start()
            .then(() => {
                return app.models.Source.find()
            })
            .then((sourceRecords) => {
                if (sourceRecords.length > 0) {
                    return app.utility.promiseConveyor(function (resolve, reject) {
                        sourceRecords.forEach((sourceRecord) => {
                            SourceManager.create(sourceRecord).then(resolve).catch(reject);
                        });
                    });
                }
            })
            .catch((err) => {
                logger.error('Error while running Source Process Manager: ' + err);
            });
    });

    process.nextTick(cb);
};
