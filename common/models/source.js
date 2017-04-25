'use strict';
let _ = require('lodash');

module.exports = function(Source) {

    Source.observe('after save', function (ctx, next) {
        let app = Source.app;
        let logger = app.logger;
        let sourceRecord = ctx.instance;

        if (ctx.isNewInstance && sourceRecord &&  sourceRecord.inputIdList.length > 0) {
            sourceRecord.connect(sourceRecord.inputIdList)
                .then(function () {
                    next();
                })
                .catch(function (err) {
                    logger.info('Error while connecting Source: ' + sourceRecord.getId() + ' - ' + err);

                    next(err);
                });
        } else {
            next();
        }
    });

    Source.observe('before save', function (ctx, next) {
        let app = Source.app;
        let logger = app.logger;
        let newSourceRecord = ctx.instance;
        let oldSourceRecord;
        let sourceDiff;

        if (!ctx.isNewInstance && newSourceRecord) {
            Source.findById(newSourceRecord.id)
                .then(function (sourceRecord) {
                    oldSourceRecord = sourceRecord;
                    sourceDiff = Source.compareTwoSources(oldSourceRecord, newSourceRecord);

                    return sourceDiff.disconnect.length > 0 ? oldSourceRecord.disconnect(sourceDiff.disconnect) : oldSourceRecord;
                })
                .then(function () {
                    return sourceDiff.connect.length > 0 ? oldSourceRecord.connect(sourceDiff.connect) : oldSourceRecord;
                })
                .then(function () {
                    logger.info('Source: ' + oldSourceRecord.getId() + ' updated');
                    next();
                })
                .catch(function (err) {
                    logger.info('Error while updating Source: ' + oldSourceRecord.getId() + ' - ' + err);

                    next(err);
                });
        } else {
            next();
        }
    });

    Source.observe('before delete', function (ctx, next) {
        let logger = Source.app.logger;

        Source.find({ where: ctx.where })
            .then(function (sourceRecords) {
                return Source.disconnectFewSources(sourceRecords);
            })
            .then(function () {
                next();
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Sources (' + JSON.stringify(ctx.where) + '): ' + err);

                next(err);
            });
    });

    /**
     * Connect Source to Input
     * @param {array} inputIdList Connections array
     * @param {Function(Error)} callback
     */

    Source.prototype.connect = function (inputIdList, callback) {
        let me = this;
        let app = Source.app;
        let logger = app.logger;
        let inputModel = app.models.Input;

        return new Promise (function (resolve, reject) {
            inputModel.updateAll({ id: { inq: inputIdList } }, {
                connected: true,
                sourceId: me.getId()
            })
                .then(function () {
                    return me.updateAttributes({
                        connected: inputIdList && inputIdList.length > 0 ? true : false,
                        inputIdList: Array.from(new Set(me.inputIdList ? me.inputIdList.concat(inputIdList) : [inputIdList]))
                    });
                })
                .then(function (source) {
                    logger.info('Source: ' + me.getId() + ' connected to next Inputs: ' + inputIdList.toString());

                    if (callback) {
                        callback(null, source)
                    }

                    resolve(source);
                })
                .catch(function (err) {
                    logger.info('Error while connecting Source: ' + me.getId() + ' to next Inputs: ' + inputIdList.toString() + ' - ' + err);

                    if (callback) {
                        callback(err)
                    }

                    reject(err);
                });
        });
    };

    /**
     * Disconnect Source from Inputs
     * @param {array} inputIdList Connections array
     * @param {Function(Error)} callback
     */

    Source.prototype.disconnect = function (inputIdList, callback) {
        let me = this;
        let app = Source.app;
        let logger = app.logger;
        let inputModel = app.models.Input;
        let inputIdSet = new Set(me.inputIdList);

        inputIdList.forEach(function (inputId) {
            inputIdSet.delete(inputId);
        });

        return new Promise (function (resolve, reject) {
            me.updateAttributes({ inputIdList: Array.from(inputIdSet) })
                .then(function () {
                    return inputModel.updateAll({ id: { inq: inputIdList } }, {
                        connected: false,
                        sourceId: 0
                    });
                })
                .then(function (info) {
                    return me._getRelation('relatedInputs');
                })
                .then(function (relatedInputs) {
                    if (relatedInputs.length === 0) {
                        return me.updateAttributes({ connected: false });
                    }
                })
                .then(function () {
                    logger.info('Source: ' + me.getId() + ' disconnected from next Inputs: ' + inputIdList.toString());

                    if (callback) {
                        callback(null);
                    }

                    resolve();
                })
                .catch(function (err) {
                    logger('Error while disconnecting Source: ' + me.getId() + ' - ' + err);

                    if (callback) {
                        callback(err);
                    }

                    reject(err);
                });
        });
    };

    Source.prototype._getRelation = function (relationKey) {
        let me = this;

        return new Promise (function (resolve, reject) {
            me[relationKey](function (err, relation) {
                if (err) {
                    reject(err);
                } else {
                    resolve(relation);
                }
            });
        });
    };

    Source.compareTwoSources = function (oldSource, newSource) {
        let oldInputIdList = oldSource.inputIdList;
        let newInputIdList = newSource.inputIdList;

        return {
            connect: _.difference(newInputIdList, oldInputIdList),
            disconnect: _.difference(oldInputIdList, newInputIdList)
        }
    };

    Source.disconnectFewSources = function (sourceRecords) {
        let app = Source.app;

        return new Promise (function (resolve, reject) {
            app.utility.conveyor((function* () {
                for (let index = 0; index < sourceRecords.length; index++) {
                    if (sourceRecords[index].connected === true) {
                        yield sourceRecords[index].disconnect(sourceRecords[index].inputIdList);
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
