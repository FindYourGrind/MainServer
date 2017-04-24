'use strict';

module.exports = function(Output) {

    Output.on('set', function(outputInstance) {
        let app = Output.app;
        let logger = app.logger;
        let outputId = outputInstance.getId();

        logger.info('Output: ' + outputId + ' updated. Notification started');

        app.wsInstance.emit('output-' + outputId + '-updated', outputInstance);
    });

    Output.observe('before delete', function beforeOutputDelete (ctx, next) {
        let logger = Output.app.logger;
        let outputRecordId = ctx.where.id;

        Output.findById(outputRecordId)
            .then(function (outputRecord) {
                if (outputRecord.connected === true) {
                    return outputRecord.disconnect(outputRecord.sinkIdList);
                }
            })
            .then(function () {
                logger.info('Output: ' + outputRecordId + ' disconnected');
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Output: ' + outputRecordId + ' - ' + err);
            });

        next();
    });

    /**
     *
     * @param outputId
     * @param value
     */
    Output.setValueById = function (outputId, value) {
        let app = Output.getApp();

        Output.findById(outputId)
            .then(function (output) {
                return output;
            })
            .then(function (output) {
                return output.updateAttributes({
                    value: value,
                    updateTimeStamp: new Date()
                });
            })
            .then(function (output) {
                output.getConnection().forEach(function (connection) {
                    app.emit('source-' + connection + '-output-' + output.getId() + '-value-set');
                });
            })
            .catch(function () {
                console.log('Error while set Output value');
            });
    };

    /**
     * Disconnect Output from Sinks
     * @param {array} sinkIdList List of Sinks Ids to be disconnected
     * @param {Function(Error)} callback
     */

    Output.prototype.disconnect = function(sinkIdList, callback) {
        let me = this;
        let app = Output.app;
        let logger = app.logger;
        let sinkModel = app.models.Sink;
        let sinkIdSet = new Set(me.sinkIdList);

        sinkIdList.forEach(function (sinkId) {
            sinkIdSet.delete(sinkId);
        });

        return new Promise(function (resolve, reject) {
            me.updateAttributes({ sinkIdList: Array.from(sinkIdSet) })
                .then(function () {
                    return sinkModel.updateAll({id: {inq: sinkIdList}}, {
                        outputId: 0,
                        connected: false
                    });
                })
                .then(function () {
                    return me._getRelation('relatedSinks');
                })
                .then(function (relatedSinks) {
                    if (relatedSinks.length === 0) {
                        return me.updateAttributes({
                            connected: false
                        });
                    } else {
                        logger.info('Output: ' + me.getId() + ' disconnected from next Sinks: ' + sinkIdList.toString());

                        if (callback) {
                            callback(null);
                        }
                        resolve();
                    }
                })
                .then(function () {
                    logger.info('Output: ' + me.getId() + ' disconnected from next Sinks: ' + sinkIdList.toString());

                    if (callback) {
                        callback(null);
                    }
                    resolve();
                })
                .catch(function (err) {
                    logger('Error while disconnecting Output: ' + me.getId() + ' - ' + err);

                    if (callback) {
                        callback(err);
                    }
                    reject(err);
                });
        });
    };

    Output.prototype._getRelation = function (relationKey) {
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
    }
};
