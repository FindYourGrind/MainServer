'use strict';

let winston = require('winston');

module.exports = function (app) {
    let loggerConfiguration = {
        levels: {
            info: 99,
            warn: 1,
            error: 2,
            senecaInfo: 3,
            senecaError: 4,
            sourceMicroService: 5,
            sourceMicroServiceErr: 6
        },
        colors: {
            info: 'green',
            warn: 'orange',
            error: 'red',
            senecaInfo: 'green',
            senecaError: 'red',
            sourceMicroService: 'green',
            sourceMicroServiceErr: 'red'
        }
    };

    app.logger = new (winston.Logger)({
        levels: loggerConfiguration.levels,
        colors: loggerConfiguration.colors,
        transports: [
            new (winston.transports.Console)({
                name: 'consoleTransport',
                level:'info',
                colorize: true
            })
        ]
    });
};
