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
        },

        promiseConveyor: function (func) {
            let generator = (function* () {
                yield new Promise ((resolve, reject) => {
                    func(resolve, reject);
                });
            })();

            function nextIteration (generator) {
                let next = generator.next();

                return new Promise ((resolve, reject) => {
                    if (!next.done) {
                        next.value
                            .then(() => {
                                return nextIteration(generator);
                            })
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                generator.throw(err);
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    } else {
                        resolve();
                    }
                });
            }

            return nextIteration(generator);
        }
    };
};
