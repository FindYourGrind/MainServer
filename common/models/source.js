'use strict';

module.exports = function(Source) {
    // Source.on('set', function(sourceInstance) {
    //
    // });
    //

    Source.observe('after save', function afterSourceCreate (ctx, next) {
        if (ctx.isNewInstance &&
            ctx.instance &&
            ctx.instance.inputIdList) {
            ctx.instance.connect(ctx.instance.inputIdList, function (err, source) {
                next();
            });
        } else {
            next();
        }
    });

    Source.observe('before delete', function beforeOutputDelete (ctx, next) {
        let logger = Output.app.logger;

        Source.findById(ctx.where.id)
            .then(function (sourceRecord) {
                if (sourceRecord.connected === true) {
                    sourceRecord.disconnect(sourceRecord.inputIdList, function (err) {
                        if (err) { throw err; }

                        logger.info('Source: ' + ctx.where.id + ' disconnected');
                    });
                }
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Source: ' + ctx.where.id + ' - ' + err);
            });

        next();
    });

    /**
     * Connect Source to Input
     * @param {array} inputs Connections array
     * @param {Function(Error)} callback
     */

    Source.prototype.connect = function(inputs, callback) {
        let me = this;
        let app = Source.app;
        let inputModel = app.models.Input;

        inputModel.find({ where: { id: { inq: [].concat(inputs) } } })
            .then(function (inputRecords) {
                inputRecords.forEach(inputRecord => {
                    inputRecord.updateAttributes({
                        connected: true,
                        sourceId: me.getId()
                    })
                });

                return me.updateAttributes({
                    connected: true,
                    inputIdList: Array.from(new Set(me.inputIdList ? me.inputIdList.concat(inputs) : [inputs]))
                });
            })
            .then(function (source) {
                callback(null, source)
            })
            .catch(function (err) {
                console.log(err);
                callback(err);
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

        return new Promise (function (resolve, reject) {
            inputModel.updateAll({ where: { sourceId: { inq: inputIdList } } },
                {
                    connected: false,
                    sourceId: 0
                })
                .then(function () {
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
                    reject();
                });
        });
    };
};
