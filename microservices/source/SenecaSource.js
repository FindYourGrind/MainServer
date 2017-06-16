let seneca = module.exports = require('seneca')();
let SourceFactory = require('./SourceFactory');

const ROLE = 'sourceFactory';
const OK_RESPONSE = 'ok';
const ERROR_RESPONSE = 'error';

const DB_CONFIG = {
    name: 'main_server',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    port: 5432
};

seneca
    .use(require('seneca-entity'))
    .use(require('seneca-postgres-store'), DB_CONFIG)
    .use(function () {
        seneca.add({role: ROLE, cmd: 'create'}, (message, callback) => {
            SourceFactory.create(message.data)
                .then(() => {
                    callback(null, { response: OK_RESPONSE })
                })
                .catch((err) => {
                    callback(err, { response: ERROR_RESPONSE, info: err  })
                });
        });

        seneca.add({role: ROLE, cmd: 'remove'}, (message, callback) => {
            SourceFactory.remove(message.data.id)
                .then(() => {
                    callback(null, { response: OK_RESPONSE })
                })
                .catch((err) => {
                    callback(err, { response: ERROR_RESPONSE, info: err  })
                });
        });

        seneca.add({role: ROLE, cmd: 'update'}, (message, callback) => {
            SourceFactory.update(message.data)
                .then(() => {
                    callback(null, { response: OK_RESPONSE })
                })
                .catch((err) => {
                    callback(err, { response: ERROR_RESPONSE, info: err })
                });
        });

        seneca.add({role: ROLE, cmd: 'getHealth'}, (message, callback) => {
            callback(null, { response: OK_RESPONSE, health: SourceFactory.getHealth(message.data.id) })
        });
    })
    .ready((err) => {
        seneca.act({ role: ROLE, cmd: 'ready', data: { err: err } }, (err, result) => {
            if (!err) {
                console.log('Source process ready');
            }
        });
    })
    .listen(10556)
    .client(10555);

