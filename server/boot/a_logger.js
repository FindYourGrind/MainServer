'use strict';

let winston = require('winston');

module.exports = function (app) {
    winston.addColors({
        info: 'green',
        warn: 'yellow',
        error: 'red'
    });

    app.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true
            }),
            //new (winston.transports.File)({ filename: __dirname + '/../log/serverLog.log' })
        ]
    });
};
