'use strict';

module.exports = function(Core) {

    /**
     * Remove Core with all ValueHolders
     * @param {Function(Error)} callback
     */
    Core.prototype.CompleteRemoval = function(callback) {
        let valueHolderModel = Core.app.models.ValueHolder;
        let coreId = this.getId();

        valueHolderModel.destroyAll({ coreId: coreId }, function (err) {
            if (err) {
                callback(new Error('Error while deleting ValueHolders'));
                return;
            }

            Core.destroyById(coreId, function (err) {
                if (err) {
                    callback(new Error('Error while deleting Core'));
                    return;
                }

                callback(null);
            })
        });
    };

};
