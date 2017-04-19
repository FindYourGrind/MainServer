'use strict';

module.exports = function(Source) {
    // Source.on('set', function(sourceInstance) {
    //
    // });
    //

    Source.observe('after save', function onSourceCreate (ctx, next) {
        if (ctx.isNewInstance &&
            ctx.instance &&
            ctx.instance.input) {
            ctx.instance.connect(ctx.instance.input, function (err, source) {
                next();
            });
        } else {
            next();
        }
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
                        source: me.getId()
                    })
                });

                return me.updateAttributes({
                    connected: true,
                    inputIdList: me.inputIdList ? me.inputIdList.concat(inputs) : [inputs]
                });
            })
            .then(function (source) {
                callback(null, source)
            })
            .catch(function (err) {
                console.log(err);
            });
    };
};
