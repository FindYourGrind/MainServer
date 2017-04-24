'use strict';

module.exports = function(Core) {

    Core.on('set', function(coreInstance) {
        let app = Core.app;
        let logger = app.logger;
        let coreId = coreInstance.getId();

        logger.info('Core: ' + coreId + ' updated. Notification started');

        app.wsInstance.emit('core-' + coreId + '-updated', coreInstance);
    });

    /**
     * Remove Core with all ValueHolders
     * @param {Function(Error)} callback
     */
    Core.prototype.CompleteRemoval = function(callback) {
        let me = this;
        let inputModel = Core.app.models.Input;
        let outputModel = Core.app.models.Output;
        let coreId = me.getId();

        inputModel.destroyAll({ coreId: coreId })
            .then(function (info) {
                return outputModel.destroyAll({ coreId: coreId });
            })
            .then(function (info) {
                return Core.destroyById(coreId);
            })
            .then(function () {
                callback(null);
            })
            .catch(function (err) {
                callback(err);
            });
    };

};
