let Seneca = require('seneca');

module.exports = function (app) {
    app.seneca = Seneca({ log:'silent' })
        .listen(10555)
        .client(10556)
        .client(10557);
};
