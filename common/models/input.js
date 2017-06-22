'use strict';

let ValueMapper = require('../../server/valueMapper/ValueMapper');

module.exports = function(Input) {

    Input.observe('before delete', function beforeInputDelete (ctx, next) {
        let logger = Input.app.logger;

        Input.find({ where: ctx.where })
            .then(function (inputRecords) {
                return Input.disconnectFewInputs(inputRecords);
            })
            .then(function () {
                next();
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Inputs (' + JSON.stringify(ctx.where) + '): ' + err);

                next(err);
            });
    });

    /**
     *
     * @param inputIdList
     * @param value
     */
    Input.updateInputsValue = function (inputIdList, value) {
        let app = Input.app;
        let logger = app.logger;

        return new Promise (function (resolve, reject) {
            Input.find({ where: { id: { inq: inputIdList } }, include: ['valueMapper']  })
                .then(function (inputRecords) {
                    return app.utility.promiseConveyor((resolve, reject) => {
                        inputRecords.forEach((inputRecord) => {
                            inputRecord.updateAttributes({
                                value: value,
                                processedValue: ValueMapper.processValue(inputRecord.__data.valueMapper, value),
                                updateTimeStamp: new Date()
                            }).then(resolve).catch(reject);
                        })
                    });
                })
                .then(resolve)
                .catch(function (err) {
                    logger.error('Error while converting Inputs: ' + inputIdList + ' values - ' + err);
                    reject(err);
                });
        });
    };

    /**
     * Disconnect Input from Source
     * @param {number} sourceId Id of Source to be disconnected
     * @param {Function(Error)} callback
     */

    Input.prototype.disconnect = function(sourceId, callback) {
        let me = this;
        let app = Input.app;
        let logger = app.logger;
        let sourceModel = app.models.Source;

        return new Promise (function (resolve, reject) {
            me.updateAttributes({
                sourceId: 0,
                connected: false
            }).then(function () {
                return sourceModel.findById(sourceId);
            }).then(function (sourceRecord) {
                return sourceRecord.disconnect([me.getId()]);
            }).then(function (response) {
                logger.info('Input: ' + me.getId() + ' disconnected from Source: ' + sourceId);

                if (callback) {
                    callback(null);
                }

                resolve();
            }).catch(function (err) {
                logger.error('Error while disconnecting Input: ' + me.getId() + ' from Source: ' + sourceId);

                if (callback) {
                    callback(err);
                }

                reject(err);
            });
        });
    };

    Input.disconnectFewInputs = function (inputRecords) {
        let app = Input.app;

        return new Promise (function (resolve, reject) {
            app.utility.conveyor((function* () {
                for (let index = 0; index < inputRecords.length; index++) {
                    if (inputRecords[index].connected === true) {
                        yield inputRecords[index].disconnect(inputRecords[index].sourceId);
                    } else {
                        yield new Promise (function (resolve) {
                            resolve();
                        });
                    }
                }
            })(), function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
};
