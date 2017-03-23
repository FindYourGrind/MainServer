'use strict';

module.exports = function(app, cb) {

  app.on('started', function () {
    app.wsInstance = require('socket.io')(app.serverInstance);

    app.wsInstance.set('authorization', function (handshakeData, accept) {
      accept(null, true);
    });

    app.wsInstance.on('connection', function (socket) {
      console.log('connected to WS');

      socket.on('disconnect', function () {
        console.log('disconnected to WS');
      });
    });

    app.emit('wsReady');
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
