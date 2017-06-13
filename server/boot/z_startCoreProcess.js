const CoreManager = require('../microServiceManager/core/CoreManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', () => {
        (new CoreManager()).start()
            .then(() => {
                return app.models.Core.find()
            })
            .then((coreRecords) => {
                if (coreRecords.length > 0) {
                    return app.utility.promiseConveyor(function (resolve, reject) {
                        coreRecords.forEach((coreRecord) => {
                            CoreManager.create(coreRecord).then(resolve).catch(reject);
                        });
                    });
                }
            })
            .catch((err) => {
                logger.error('Error while running Core Process Manager: ' + err);
            });
    });

    process.nextTick(cb);
};
