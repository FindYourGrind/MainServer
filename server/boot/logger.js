'use strict';

let winston = require('winston');

module.exports = function (app) {
    app.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: __dirname + '/../log/serverLog.log' })
        ]
    });
};
