'use strict';

module.exports = function(Input) {

    /**
     *
     * @param inputId
     * @param value
     */
    Input.setValueById = function (inputId, value) {
        let app = Input.app;

        Input.findById(inputId)
            .then(function (input) {
                return input;
            })
            .then(function (input) {
                return input.updateAttributes({
                    value: value,
                    updateTimeStamp: new Date()
                });
            })
            .then(function (input) {
                app.emit('core-' + input.getCoreId() + '-input-' + input.getId() + '-value-set');
            })
            .catch(function () {
                console.log('Error while set Input value');
            });
    };

    /**
     *
     * @param sourceId
     */
    Input.connectToSource = function (inputIds, sourceId, callback) {
        Input.updateAll({ id: { inq: inputIds } },
            {
                connected: true,
                connection: sourceId
            })
            .then(function (input) {
                callback(null, input);
            })
            .catch(function (err) {
                callback(err);
            });
    };

    /**
     *
     */
    Input.disconnect = function (inputId) {
        Input.findById(inputId)
            .then(function (input) {
                return input.updateAttributes({
                    connected: false,
                    connection: 0
                });
            })
            .then(function () {

            })
            .catch(function () {

            });
    };
};
