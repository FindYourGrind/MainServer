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

    /**
     * Connect Sink to Output
     * @param {number} output Output Id to connect
     * @param {Function(Error)} callback
     */

    Sink.prototype.connect = function(output, callback) {
        let me = this;
        let app = Sink.app;
        let outputModel = app.models.Output;

        outputModel.findById(output)
            .then(function (outputRecord) {
                return outputRecord.updateAttributes({
                    connected: true
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
     * @param {number} sinkId Id of Sink to be disconnected
     * @param {Function(Error)} callback
     */

    Sink.prototype.disconnect = function(sinkId, callback) {
        // TODO
        callback(null);
    };


};
