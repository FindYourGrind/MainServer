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
            microServiceInfo: 5,
            microServiceErr: 6,
            sourceMicroServiceInfo: 7,
            sourceMicroServiceErr: 8,
            sinkMicroServiceInfo: 9,
            sinkMicroServiceErr: 10
        },
        colors: {
            info: 'green',
            warn: 'orange',
            error: 'red',
            senecaInfo: 'green',
            senecaError: 'red',
            microServiceInfo: 'green',
            microServiceErr: 'red',
            sourceMicroServiceInfo: 'green',
            sourceMicroServiceErr: 'red',
            sinkMicroServiceInfo: 'green',
            sinkMicroServiceErr: 'red'
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
        ],
        filters:   [
            function (level, msg) {
               return msg.replace(/(\r\n|\n|\r)/gm,"");
            }
        ]
    });
};
