'use strict';

module.exports = function(app, cb) {

  app.on('started', function () {
    app.wsInstance = require('socket.io')(app.serverInstance);

    app.wsInstance.set('authorization', function (handshakeData, accept) {
      // app.models.AccessToken.findForRequest(req, {}, function (err, token) {
      //   if (err) {
      //     req.flash('error', { msg: 'Sorry, something went wrong! ' + err.message });
      //     return res.redirect('back');
      //   }
      //   console.log('Token2: ' + token.id);
      // });
      let userId = handshakeData._query.userId;
      let accessToken = handshakeData._query.accessToken;

      console.log(userId);
      console.log(accessToken);

      if (userId && accessToken) {
        app.models.User.confirm(userId, accessToken)
          .then(function () {
            debugger;
            accept(null, true);
          }, function () {
            debugger;
          });
      } else {
        accept('Not authorized', false);
      }
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
