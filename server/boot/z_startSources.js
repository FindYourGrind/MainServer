const SourceManager = require('../source/SourceManager');

const ROLE = 'sourceFactory';

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', function () {
        let sourceModel = app.models.Source;

        sourceModel.find()
            .then(function (sourceRecords) {
                sourceRecords.forEach(function (sourceRecord) {
                    SourceManager.createSourceProcess(sourceRecord);

                    app.seneca.act({role: ROLE, cmd: 'create', data: sourceRecord.getData()}, (err, result) => {
                        if (err) {
                            logger.error('Error while creating Source');
                        }

                        console.log(result)
                    });

                    if (sourceRecord.connected === true) {
                        SourceManager.runSourceProcess(sourceRecord.getId());

                        app.seneca.act({role: ROLE, cmd: 'run', data: sourceRecord.getData()}, (err, result) => {
                            if (err) {
                                logger.error('Error while running Source');
                            }

                            console.log(result)
                        });

                    }
                });
            })
            .catch(function () {
                logger.error('Error while queueing Source Records');
            });

    });

    process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};