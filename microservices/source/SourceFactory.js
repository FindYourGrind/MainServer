let senecaSource = require('./SenecaSource');
let Source = require('./Source');
let WebSocketSource = require('./WebSocketSource');
let TimerSource = require('./TimerSource');
let TelegramSource = require('./TelegramSource');

let sourcePool = new Map();

class SourceFactory {

    static create (sourceData, notificationCallback) {
        return new Promise((resolve, reject) => {
            senecaSource.make('SourceWorkerType').list$({ type: sourceData.type }, (err, sourceTypes) => {
                if (err) {
                    reject(err);
                } else if (sourceTypes.length === 0) {
                    reject('No such source type: ' + sourceData.type);
                } else {
                    let source;

                    switch(sourceTypes[0].type) {
                        case 1:
                            source = new WebSocketSource(sourceData, sourceTypes[0], notificationCallback);
                            break;
                        case 2:
                            source = new TimerSource(sourceData, sourceTypes[0], notificationCallback);
                            break;
                        case 3:
                            source = new TelegramSource(sourceData, sourceTypes[0], notificationCallback);
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
                        .catch(reject);
                }
            });
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
