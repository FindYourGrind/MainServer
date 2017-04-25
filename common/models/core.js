'use strict';

module.exports = function(Core) {

    Core.observe('before delete', function (ctx, next) {
        let logger = Core.app.logger;

        Core.find({ where: ctx.where })
            .then(function (coreRecords) {
                return Core.completeRemoveFewCores(coreRecords);
            })
            .then(function () {
                next();
            })
            .catch(function (err) {
                logger.warn('Error while deleting Cores (' + JSON.stringify(ctx.where) + '): ' + err);

                next(err);
            });
    });

    Core.completeRemoveFewCores = function (coreRecords) {
        let app = Core.app;
        let inputModel = app.models.Input;
        let outputModel = app.models.Output;

        return new Promise (function (resolve, reject) {
            app.utility.conveyor((function* () {
                for (let index = 0; index < coreRecords.length; index++) {
                    let coreId = coreRecords[index].getId();

                    yield inputModel.destroyAll({ coreId: coreId })
                        .then(function () {
                            return outputModel.destroyAll({ coreId: coreId });
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                }
            })(), function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    Core.prototype._getRelation = function (relationKey) {
        let me = this;

        return new Promise (function (resolve, reject) {
            me[relationKey](function (err, relation) {
                if (err) {
                    reject(err);
                } else {
                    resolve(relation);
                }
            });
        });
    };
};
