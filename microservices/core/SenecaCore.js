let seneca = require('seneca')();
let CoreFactory = require('./CoreFactory');

const ROLE = 'coreFactory';
const OK_RESPONSE = 'ok';
const ERROR_RESPONSE = 'error';

seneca
    .use(function () {
        seneca.add({role: ROLE, cmd: 'create'}, (message, callback) => {
            CoreFactory.create(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'remove'}, (message, callback) => {
            CoreFactory.remove(message.data.id, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'update'}, (message, callback) => {
            CoreFactory.update(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'createInput'}, (message, callback) => {
            CoreFactory.createInput(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'removeInput'}, (message, callback) => {
            CoreFactory.removeInput(message.data.id, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'updateInput'}, (message, callback) => {
            CoreFactory.updateInput(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'createOutput'}, (message, callback) => {
            CoreFactory.createOutput(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'removeOutput'}, (message, callback) => {
            CoreFactory.removeOutput(message.data.id, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'updateOutput'}, (message, callback) => {
            CoreFactory.updateOutput(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });
    })
    .ready((err) => {
        seneca.act({ role: ROLE, cmd: 'ready', data: { err: err } }, (err, result) => {
            if (!err) {
                console.log('Core process ready');
            }
        });
    })
    .listen(10558)
    .client(10555);

