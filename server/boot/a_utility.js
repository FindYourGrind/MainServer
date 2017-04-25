'use strict';

module.exports = function (app) {
    app.utility = {
        conveyor: function (generator, callback) {
            let next = generator.next();

            try {
                if (!next.done) {
                    next.value
                        .then(function () {
                            app.utility.conveyor(generator, callback);
                        })
                        .catch(function (err) {
                            generator.throw(err);
                        });
                } else {
                    callback(null);
                }
            } catch (err) {
                callback(err);
            }
        }
    };
};
