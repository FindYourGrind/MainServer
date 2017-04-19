'use strict';

module.exports = function(Sink) {
    Sink.observe('after save', function onSinkCreate (ctx, next) {
        console.log('Sink created');
        next();
    });

    /**
     * Connect Sink to Output
     * @param {number} connection Output Id to connect
     * @param {Function(Error)} callback
     */

    Sink.prototype.connect = function(connection, callback) {
        let me = this;
        let app = Sink.app;
        let outputModel = app.models.Output;

        outputModel.connectToSink(connection, me.getId(), function (err, output) {
            if (err) {
                callback(err);
            }

            me.updateAttributes({
                connected: true,
                connection: connection
            }).then(function (sink) {
                callback(null, sink)
            }).catch(function (err) {
                callback(err);
            })
        });
    };

};
