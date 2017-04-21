'use strict';

module.exports = function(Output) {

    Output.observe('before delete', function beforeOutputDelete (ctx, next) {
        let logger = Output.app.logger;

        Output.findById(ctx.where.id)
            .then(function (outputRecord) {
                if (outputRecord.connected === true) {
                    outputRecord.relatedSinks(function (err, relatedSinks) {
                        let sinkIdList = relatedSinks.map(function (sink) {
                            return sink.id;
                        });

                        outputRecord.disconnect(sinkIdList, function (err) {
                            if (err) { throw err; }

                            logger.info('Output: ' + ctx.where.id + ' disconnected');
                        });
                    });
                }
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Output: ' + ctx.where.id + ' - ' + err);
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

        return new Promise(function (resolve, reject) {
            sinkModel.updateAll({ id: { inq: sinkIdList } },
                {
                    outputId: 0,
                    connected: false
                })
                .then(function (info) {
                    logger.info('Output: ' + me.getId() + ' disconnected from next Sinks: ' + sinkIdList.toString());

                    me.relatedSinks(function (err, relatedSinks) {
                        if (relatedSinks.length === 0) {
                            me.updateAttributes({ connected: false })
                                .then(function () {
                                    if (callback) {
                                        callback(null);
                                    }
                                    resolve(info);
                                })
                                .catch(function (err) {
                                    throw err;
                                });
                        } else {
                            if (callback) {
                                callback(null);
                            }
                            resolve(info);
                        }
                    });
                })
                .catch(function (err) {
                    if (callback) {
                        callback(err);
                    }
                    reject(err);
                });
        });
    };
};
