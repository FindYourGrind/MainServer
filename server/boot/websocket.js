'use strict';

module.exports = function (app, cb) {
    const logger = app.logger;

    app.on('started', function () {
        let socketIO = require('socket.io')(app.serverInstance);
        let accountModel = app.models.Account;

        app.wsInstance = socketIO;
        app.wsUserNamespaces = new Map();

        app.wsInstance.set('authorization', function (handshakeData, accept) {
            let userId = handshakeData._query.userId;
            let accessToken = handshakeData._query.accessToken;

            accept(null, true);

            // if (userId && accessToken) {
            //     app.models.AccessToken.find({userId: userId})
            //         .then(tokenRecords => {
            //             Array.isArray(tokenRecords) && tokenRecords.some(function (tokenRecord) {
            //                 return tokenRecord.id === accessToken;
            //             }) ? accept(null, true) : accept('Not authorized', false);
            //         }, err => {
            //             accept('Not authorized', false);
            //         });
            // } else {
            //     accept('Not authorized', false);
            // }
        });

        app.wsInstance.on('connection', function (socket) {
            logger.info('connected to WS');

            socket.on('doDisconnect', function () {
                socket.disconnect(true);
            });

            socket.on('disconnect', function () {
                logger.info('disconnected to WS');
            });
        });

        accountModel.find()
            .then(function (userRecords) {
                userRecords.forEach(function (userRecord) {
                    let userId = userRecord.getId();
                    let userNamespace = app.wsInstance.of('ws-namespace-' + userId);

                    userNamespace.on('connection', function(socket){
                        logger.info('Connected to namespace of user: ' + userId);
                    });

                    app.wsUserNamespaces.set(userId, userNamespace);
                });
            })
            .catch(function () {
                logger.warn('Error while loading account records');
            });

        app.emit('wsReady');
    });

    process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
