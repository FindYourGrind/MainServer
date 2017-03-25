'use strict';

module.exports = function (app, cb) {

    app.on('started', function () {
        app.wsInstance = require('socket.io')(app.serverInstance);

        app.wsInstance.set('authorization', function (handshakeData, accept) {
            let userId = handshakeData._query.userId;
            let accessToken = handshakeData._query.accessToken;

            if (userId && accessToken) {
                app.models.AccessToken.find({userId: userId})
                    .then(tokenRecords => {
                        Array.isArray(tokenRecords) && tokenRecords.some(function (tokenRecord) {
                            return tokenRecord.id === accessToken;
                        }) ? accept(null, true) : accept('Not authorized', false);
                    }, err => {
                        accept('Not authorized', false);
                    });
            } else {
                accept('Not authorized', false);
            }
        });

        app.wsInstance.on('connection', function (socket) {
            console.log('connected to WS');

            socket.on('doDisconnect', function () {
                socket.disconnect(true);
            });

            socket.on('disconnect', function () {
                console.log('disconnected to WS');
            });
        });

        app.emit('wsReady');
    });

    process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
