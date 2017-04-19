'use strict';

module.exports = function(Source) {
    // Source.on('set', function(sourceInstance) {
    //
    // });
    //
    // Source.observe('after save', function updateTimestamp(ctx, next) {
    //     let valueHolderModel = Source.app.models.ValueHolder;
    //     let model = ctx.instance || ctx.data;
    //     let connectionsIds = model.connection || [];
    //
    //     valueHolderModel.find({
    //         where: {
    //             id: {
    //                 inq: connectionsIds
    //             }
    //         }
    //     }, function (err, valueHolders) {
    //         if (err) {
    //             next('Error while connect to ValueHolders');
    //         } else {
    //             valueHolders.forEach(function (valueHolder) {
    //                 valueHolder.updateAttributes({
    //                     connected: true,
    //                     connection: model.id
    //                 }, function (err) {
    //                     if (err) {
    //                         next('Error while connect to ValueHolders');
    //                     } else {
    //                         next();
    //                     }
    //                 })
    //             })
    //         }
    //     });
    // });

    /**
     * Connect Source to Input
     * @param {array} connection Connections array
     * @param {Function(Error)} callback
     */

    Source.prototype.connect = function(connection, callback) {
        let me = this;
        let app = Source.app;
        let inputModel = app.models.Input;

        inputModel.connectToSource(connection, me.getId(), function (err, input) {
            if (err) {
                callback(err);
            }

            me.updateAttributes({
                connected: true,
                connection: me.connection ? me.connection.concat(connection) : connection
            }).then(function (source) {
                callback(null, source)
            }).catch(function (err) {
                callback(err);
            })
        });
    };

};
