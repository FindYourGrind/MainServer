'use strict';
let Client = require('strong-pubsub');
let Adapter = require('strong-pubsub-mqtt');

module.exports = function(app, cb) {
  app.on('wsReady', function () {
    let ws = app.wsInstance;
    let client = app.mqttInstance = new Client({
      host: app.config.host,
      port: app.config.mqtt.port
    }, Adapter);

    client.connect();
    client.subscribe(app.config.mqtt.topic.mqttLogger);

    client.on('connect', function () {
      console.log('Connected to MQTT Broker on', app.config.host);
    });

    client.on('message', function (topic, message) {
      switch(topic) {
        case app.config.mqtt.topic.mqttLogger:
          ws.emit(app.config.ws.event.logger, message.toString());
          break;
        default:
          break;
      }
    });
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
