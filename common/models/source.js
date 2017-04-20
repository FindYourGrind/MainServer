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

    Source.observe('before delete', function beforeSourceDelete (ctx, next) {
        Source.disconnect(ctx.where.id, function (err) {
            next(err);
        });
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
     * @param {array} sourceId Connections array
     * @param {Function(Error)} callback
     */

    Source.prototype.disconnect = function(sourceId, callback) {
        let app = Source.app;
        let inputModel = app.models.Input;

        inputModel.find({ where: { sourceId: sourceId } })
            .then(function (inputRecords) {
                inputRecords.forEach(inputRecord => {
                    inputRecord.updateAttributes({
                        connected: false,
                        sourceId: undefined
                    })
                });

                callback(null)
            })
            .catch(function (err) {
                console.log(err);
                callback(err);
            });
    };
};
