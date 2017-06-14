let Seneca = require('seneca');

module.exports = function (app) {
    app.seneca = Seneca({ log:'silent' })
        .listen(10555)
        .client({ port: 10556, pin: { role: 'sourceFactory' } })
        .client({ port: 10557, pin: { role: 'sinkFactory' } })
        .client({ port: 10558, pin: { role: 'coreFactory' } });
};
