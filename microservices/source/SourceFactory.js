let senecaSource = require('./SenecaSource');
let Source = require('./Source');
let WebSocketSource = require('./WebSocketSource');
let TimerSource = require('./TimerSource');
let TelegramSource = require('./TelegramSource');

let sourcePool = new Map();

class SourceFactory {

    static create (sourceData, notificationCallback) {
        return new Promise((resolve, reject) => {
            let source;

            switch(sourceData.type) {
                case 1:
                    source = new WebSocketSource(sourceData, notificationCallback);
                    break;
                case 2:
                    source = new TimerSource(sourceData, notificationCallback);
                    break;
                case 3:
                    source = new TelegramSource(sourceData, notificationCallback);
                    break;
                default:
                    reject('No such source type: ' + sourceData.type);
                    break;
            }

            source.init()
                .then((result) => {
                    sourcePool.set(sourceData.id, source);
                    resolve(result);
                })
        });
    }

    static remove (sourceId) {
        let sourceInstance = sourcePool.get(sourceId);

        return sourceInstance.disable().then(() => {
            sourceInstance = null;
            sourcePool.delete(sourceId);
        });
    }

    static update (sourceData) {
        return sourcePool.get(sourceData.id).update(sourceData);
    }

    static getHealth (sourceId) {
        return sourcePool.get(sourceId).getHealth();
    }
}

module.exports = SourceFactory;
