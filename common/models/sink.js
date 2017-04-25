'use strict';

module.exports = function(Sink) {

    Sink.observe('after save', function onSinkCreate (ctx, next) {
        let app = Sink.app;
        let logger = app.logger;
        let sinkRecord = ctx.instance;

        if (ctx.isNewInstance && sinkRecord && sinkRecord.outputId) {
            sinkRecord.connect(sinkRecord.outputId)
                .then(function () {
                    next();
                })
                .catch(function (err) {
                    logger.info('Error while connecting Sink: ' + sinkRecord.getId() + ' - ' + err);

                    next(err);
                });
        } else {
            next();
        }
    });

    Sink.observe('before save', function (ctx, next) {
        let app = Sink.app;
        let logger = app.logger;
        let newSinkRecord = ctx.instance;
        let oldSinkRecord;
        let sinkDiff;

        if (!ctx.isNewInstance && newSinkRecord) {
            Sink.findById(newSinkRecord.id)
                .then(function (sinkRecord) {
                    oldSinkRecord = sinkRecord;
                    sinkDiff = Sink.compareTwoSinks(oldSinkRecord, newSinkRecord);

                    return sinkDiff.disconnect ? oldSinkRecord.disconnect(sinkDiff.disconnect) : oldSinkRecord;
                })
                .then(function () {
                    return sinkDiff.connect ? oldSinkRecord.connect(sinkDiff.connect) : oldSinkRecord;
                })
                .then(function () {
                    next();
                })
                .catch(function (err) {
                    logger.info('Error while updating Sink: ' + oldSinkRecord.getId() + ' - ' + err);

                    next(err);
                });
        } else {
            next();
        }
    });

    Sink.observe('before delete', function (ctx, next) {
        let logger = Sink.app.logger;

        Sink.find({ where: ctx.where })
            .then(function (sinkRecords) {
                return Sink.disconnectFewSinks(sinkRecords);
            })
            .then(function () {
                next();
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Sinks (' + JSON.stringify(ctx.where) + '): ' + err);

                next(err);
            });
    });

    /**
     * Connect Sink to Output
     * @param {number} outputId Output Id to connect
     * @param {Function(Error)} callback
     */

    Sink.prototype.connect = function(outputId, callback) {
        let me = this;
        let app = Sink.app;
        let logger = app.logger;
        let outputModel = app.models.Output;

        return new Promise (function (resolve, reject) {
            outputModel.findById(outputId)
                .then(function (outputRecord) {
                    return outputRecord.updateAttributes({
                        connected: true,
                        sinkIdList: Array.from(new Set(outputRecord.sinkIdList ? outputRecord.sinkIdList.concat(me.getId()) : [me.getId()]))
                    });
                })
                .then(function (outputRecord) {
                    return me.updateAttributes({
                        connected: true,
                        outputId: outputRecord.getId()
                    });
                })
                .then(function (sinkRecord) {
                    logger.info('Sink: ' + me.getId() + ' connected to next Output: ' + outputId);

                    if (callback) {
                        callback(null, sinkRecord)
                    }

                    resolve(sinkRecord);
                })
                .catch(function (err) {
                    logger.info('Error while connecting Sink: ' + me.getId() + ' to next Output: ' + outputId + ' - ' + err);

                    if (callback) {
                        callback(err)
                    }

                    reject(err);
                });
        });
    };

    /**
     * Disconnect Sink from Output
     * @param {number} outputId Id of Output to be disconnected
     * @param {Function(Error)} callback
     */

    Sink.prototype.disconnect = function(outputId, callback) {
        let me = this;
        let app = Sink.app;
        let logger = app.logger;
        let outputModel = app.models.Output;

        return new Promise (function (resolve, reject) {
            me.updateAttributes({
                outputId: 0,
                connected: false
            })
                .then(function () {
                    return outputModel.findById(outputId);
                })
                .then(function (output) {
                    return output.disconnect([me.getId()]);
                })
                .then(function (response) {
                    logger.info('Sink: ' + me.getId() + ' disconnected from Output: ' + outputId);

                    if (callback) {
                        callback(null);
                    }

                    resolve();
                })
                .catch(function (err) {
                    logger.error('Error while disconnecting Sink: ' + me.getId() + ' from Output: ' + outputId + ' - ' + err);

                    if (callback) {
                        callback(err);
                    }

                    reject(err);
                });
        });
    };

    Sink.prototype._getRelation = function (relationKey) {
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

    Sink.compareTwoSinks = function (oldSink, newSink) {
        let oldOutputId = oldSink.outputId;
        let newOutputId = newSink.outputId;

        return {
            connect: oldOutputId === newOutputId ? false : newOutputId,
            disconnect: oldOutputId === newOutputId ? false : oldOutputId
        }
    };

    Sink.disconnectFewSinks = function (sinkRecords) {
        let app = Sink.app;

        return new Promise (function (resolve, reject) {
            app.utility.conveyor((function* () {
                for (let index = 0; index < sinkRecords.length; index++) {
                    if (sinkRecords[index].connected === true) {
                        yield sinkRecords[index].disconnect(sinkRecords[index].outputId);
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
