let seneca = require('seneca')();

const ROLE = 'sourceFactory';
const OK_RESPONSE = 'ok';

seneca.use(function () {
    seneca.add({ role: ROLE, cmd: 'create' }, (message, callback) => {
        console.log('create source', message.data);
        callback(null, { response: OK_RESPONSE })
    });

    seneca.add({ role: ROLE, cmd: 'delete' }, (message, callback) => {
        console.log('delete source', message.data);
        callback(null, { response: OK_RESPONSE })
    });

    seneca.add({ role: ROLE, cmd: 'update' }, (message, callback) => {
        console.log('update source', message.data);
        callback(null, { response: OK_RESPONSE })
    });

    seneca.add({ role: ROLE, cmd: 'run' }, (message, callback) => {
        console.log('run source', message.data);
        callback(null, { response: OK_RESPONSE })
    });

    seneca.add({ role: ROLE, cmd: 'stop' }, (message, callback) => {
        console.log('stop source', message.data);
        callback(null, { response: OK_RESPONSE })
    });
}).listen();

