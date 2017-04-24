'use strict';

module.exports = function(Input) {

    Input.on('set', function(inputInstance) {
        let app = Input.app;
        let logger = app.logger;
        let inputId = inputInstance.getId();

        logger.info('Input: ' + inputId + ' updated. Notification started');

        app.wsInstance.emit('input-' + inputId + '-updated', inputInstance);
    });

    Input.observe('before delete', function beforeInputDelete (ctx, next) {
        let logger = Input.app.logger;

        Input.findById(ctx.where.id)
            .then(function (inputRecord) {
                if (inputRecord.connected === true) {
                    return inputRecord.disconnect(inputRecord.sourceId);
                }
            })
            .then(function () {
                next();
            })
            .catch(function (err) {
                logger.warn('Error while disconnecting Input: ' + ctx.where.id + ' - '  + err);

                next(err);
            });
    });

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
     * Disconnect Input from Source
     * @param {number} sourceId Id of Source to be disconnected
     * @param {Function(Error)} callback
     */

    Input.prototype.disconnect = function(sourceId, callback) {
        let me = this;
        let app = Input.app;
        let logger = app.logger;
        let sourceModel = app.models.Source;

        return new Promise (function (resolve, reject) {
            me.updateAttributes({
                sourceId: 0,
                connected: false
            }).then(function () {
                return sourceModel.findById(sourceId);
            }).then(function (sourceRecord) {
                return sourceRecord.disconnect([me.getId()]);
            }).then(function (response) {
                logger.info('Input: ' + me.getId() + ' disconnected from Source: ' + sourceId);

                if (callback) {
                    callback(null);
                }

                resolve();
            }).catch(function (err) {
                logger.error('Error while disconnecting Input: ' + me.getId() + ' from Source: ' + sourceId);

                if (callback) {
                    callback(err);
                }

                reject(err);
            });
        });
    };
};
