let seneca = require('seneca')();
let SourceFactory = require('./SourceFactory');

const ROLE = 'sourceFactory';
const OK_RESPONSE = 'ok';
const ERROR_RESPONSE = 'error';

seneca.use(function () {
    seneca.add({ role: ROLE, cmd: 'create' }, (message, callback) => {
        SourceFactory.create(message.data, (err) => {
            callback(err, { response: err ? ERROR_RESPONSE : OK_RESPONSE })
        });
    });

    seneca.add({ role: ROLE, cmd: 'remove' }, (message, callback) => {
        SourceFactory.remove(message.data, (err) => {
            callback(err, { response: err ? ERROR_RESPONSE : OK_RESPONSE })
        });
    });

    seneca.add({ role: ROLE, cmd: 'update' }, (message, callback) => {
        SourceFactory.update(message.data, (err) => {
            callback(err, { response: err ? ERROR_RESPONSE : OK_RESPONSE })
        });
    });

    seneca.add({ role: ROLE, cmd: 'run' }, (message, callback) => {
        SourceFactory.run(message.data, (err) => {
            callback(err, { response: err ? ERROR_RESPONSE : OK_RESPONSE })
        });
    });

    seneca.add({ role: ROLE, cmd: 'stop' }, (message, callback) => {
        SourceFactory.stop(message.data, (err) => {
            callback(err, { response: err ? ERROR_RESPONSE : OK_RESPONSE })
        });
    });
}).listen();

