let seneca = require('seneca')();

const ROLE = 'sourceFactory';
const OK_RESPONSE = 'ok';


seneca.add({ role: ROLE, cmd: 'create' }, (data, callback) => {
    console.log('create source', data);
    callback(null, { response: OK_RESPONSE })
});

seneca.add({ role: ROLE, cmd: 'delete' }, (data, callback) => {
    console.log('delete source', data);
    callback(null, { response: OK_RESPONSE })
});

seneca.add({ role: ROLE, cmd: 'update' }, (data, callback) => {
    console.log('update source', data);
    callback(null, { response: OK_RESPONSE })
});
