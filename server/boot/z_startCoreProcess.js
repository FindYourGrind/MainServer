const CoreManager = require('../microServiceManager/core/CoreManager');

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', () => {
        (new CoreManager()).start()
            .then(() => {
                return app.models.Core.find({ include: ['relatedInputs', 'relatedOutputs'] })
            })
            .then((coreRecords) => {
                if (coreRecords.length > 0) {
                    return app.utility.promiseConveyor(function (resolve, reject) {
                        coreRecords.forEach((coreRecord) => {
                            CoreManager.create(coreRecord)
                                .then(() => {
                                    resolve(coreRecords);
                                })
                                .catch(reject);
                        });
                    });
                } else {
                    return coreRecords;
                }
            })
            .then((coreRecords) => {
                if (coreRecords.length > 0 ) {
                    return app.utility.promiseConveyor(function (resolve, reject) {
                        coreRecords.forEach((coreRecord) => {
                            let relatedInputs = coreRecord.relatedInputs();

                            if (relatedInputs.length > 0 ) {
                                relatedInputs.forEach((inputRecord) => {
                                    CoreManager.createInput(inputRecord)
                                        .then(() => {
                                            resolve(coreRecords);
                                        })
                                        .catch(reject);
                                })
                            } else {
                                resolve(coreRecords);
                            }
                        });
                    });
                } else {
                    return coreRecords;
                }
            })
            .then((coreRecords) => {
                if (coreRecords.length > 0 ) {
                    return app.utility.promiseConveyor(function (resolve, reject) {
                        coreRecords.forEach((coreRecord) => {
                            let relatedOutputs = coreRecord.relatedOutputs();

                            if (relatedOutputs.length > 0 ) {
                                relatedOutputs.forEach((outputRecord) => {
                                    CoreManager.createOutput(outputRecord)
                                        .then(() => {
                                            resolve(coreRecords);
                                        })
                                        .catch(reject);
                                })
                            } else {
                                resolve(coreRecords);
                            }
                        });
                    });
                } else {
                    return coreRecords;
                }
            })
            .catch((err) => {
                logger.error('Error while running Core Process Manager: ' + err);
            });
    });

    process.nextTick(cb);
};
