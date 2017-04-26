'use strict';

module.exports = function(Workspace) {

    Workspace.observe('before delete', function (ctx, next) {
        let logger = Workspace.app.logger;

        Workspace.find({ where: ctx.where })
            .then(function (workspaceRecords) {
                return Workspace.completeRemoveFewWorkspaces(workspaceRecords);
            })
            .then(function () {
                next();
            })
            .catch(function (err) {
                logger.warn('Error while deleting Workspaces (' + JSON.stringify(ctx.where) + '): ' + err);

                next(err);
            });
    });

    Workspace.completeRemoveFewWorkspaces = function (workspaceRecords) {
        let app = Workspace.app;
        let coreModel = app.models.Core;
        let sinkModel = app.models.Sink;
        let sourceModel = app.models.Source;

        return new Promise (function (resolve, reject) {
            app.utility.conveyor((function* () {
                for (let index = 0; index < workspaceRecords.length; index++) {
                    let workspaceId = workspaceRecords[index].getId();

                    yield coreModel.destroyAll({ workspaceId: workspaceId })
                        .then(function () {
                            return sourceModel.destroyAll({ workspaceId: workspaceId });
                        })
                        .then(function () {
                            return sinkModel.destroyAll({ workspaceId: workspaceId });
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

    Workspace.prototype._getRelation = function (relationKey) {
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
