'use strict';

module.exports = function(Sink) {
    Sink.observe('after save', function onSinkCreate (ctx, next) {
        console.log('Sink created');
        next();
    });
};
