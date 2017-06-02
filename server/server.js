'use strict';
let https = require('https');
let http = require('http');
let configSSL = require('./ConfigSSL');
let bodyParser = require('body-parser');
let loopback = require('loopback');
let boot = require('loopback-boot');

let app = module.exports = loopback();

app.config = require('../config.json');

app.use(bodyParser.urlencoded({extended: true}));
app.use(loopback.token({
    model: app.models.accessToken
}));

app.start = function() {
    let server = null;

    if (app.config.httpOnly === true) {
        server = http.createServer(app);
    } else {
        server = https.createServer({
            key: configSSL.privateKey,
            cert: configSSL.certificate,
        }, app);
    }

    server.listen(app.get('port'), function() {
        let baseUrl = (app.config.httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');

        app.emit('started', baseUrl);

        console.log('LoopBack server listening @ %s%s', baseUrl, '/');

        if (app.get('loopback-component-explorer')) {
            let explorerPath = app.get('loopback-component-explorer').mountPath;

            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });

    return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.serverInstance = app.start();
  }
});
