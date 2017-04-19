'use strict';

module.exports = function(Output) {

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

    Output.connectToSink = function (outputId, sinkId, callback) {
        Output.findById(outputId)
            .then(function (output) {
                output.updateAttributes({
                    connected: true,
                    connection: output.connection ? output.connection.concat(sinkId) : [ sinkId ]
                })
                .then(function (output) {
                    callback(null, output);
                })
                .catch(function (err) {
                    callback(err);
                });
            });
    };
};
