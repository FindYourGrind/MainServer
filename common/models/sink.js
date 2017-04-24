'use strict';

module.exports = function(Sink) {

    Sink.observe('after save', function onSinkCreate (ctx, next) {
        if (ctx.isNewInstance &&
            ctx.instance &&
            ctx.instance.outputId) {
            ctx.instance.connect(ctx.instance.outputId, function (err, sink) {
                next();
            });
        } else {
            next();
        }
    });

    Sink.observe('before delete', function beforeSinkDelete (ctx, next) {
        let logger = Sink.app.logger;

        Sink.findById(ctx.where.id)
            .then(function (sinkRecord) {
                if (sinkRecord.connected === true) {
                    sinkRecord.disconnect(sinkRecord.outputId, function (err) {
                        if (err) {
                            throw err;
                        }

                        logger.info('Sink: ' + ctx.where.id + ' disconnected');
                    });
                }
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Sink: ' + ctx.where.id + ' - '  + err);
            });

        next();
    });

    /**
     * Connect Sink to Output
     * @param {number} outputId Output Id to connect
     * @param {Function(Error)} callback
     */

    Sink.prototype.connect = function(outputId, callback) {
        let me = this;
        let app = Sink.app;
        let outputModel = app.models.Output;

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
                callback(null, sinkRecord);
            })
            .catch(function (err) {
               console.log(err);
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
            callback(null);
        })
        .catch(function (err) {
            logger.error('Error while disconnecting Sink: ' + me.getId() + ' from Output: ' + outputId + ' - ' + err);
            callback(err);
        });
    };

};
