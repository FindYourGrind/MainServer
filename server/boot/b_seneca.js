let seneca = require('seneca')();

module.exports = function (app) {
    app.seneca = seneca.client();
};
