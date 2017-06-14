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
            let finalResult;
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
                            .then((result) => {
                                finalResult = result;
                                return nextIteration(generator);
                            })
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((err) => {
                                generator.throw(err);
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    } else {
                        resolve(finalResult);
                    }
                });
            }

            return nextIteration(generator);
        }
    };
};
