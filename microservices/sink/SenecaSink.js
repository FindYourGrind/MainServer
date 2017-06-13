let seneca = require('seneca')();
let SinkFactory = require('./SinkFactory');

const ROLE = 'sinkFactory';
const OK_RESPONSE = 'ok';
const ERROR_RESPONSE = 'error';

seneca
    .use(function () {
        seneca.add({role: ROLE, cmd: 'create'}, (message, callback) => {
            SinkFactory.create(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'remove'}, (message, callback) => {
            SinkFactory.remove(message.data.id, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });

        seneca.add({role: ROLE, cmd: 'update'}, (message, callback) => {
            SinkFactory.update(message.data, (err) => {
                callback(err, {response: err ? ERROR_RESPONSE : OK_RESPONSE})
            });
        });
    })
    .ready((err) => {
        seneca.act({ role: ROLE, cmd: 'ready', data: { err: err } }, (err, result) => {
            if (!err) {
                console.log('do smth on start with', result);
            }
        });
    })
    .listen(10557)
    .client(10555);

