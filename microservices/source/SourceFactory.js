let senecaSource = require('./SenecaSource');
let Source = require('./Source');
let WebSocketSource = require('./WebSocketSource');

let sourcePool = new Map();

class SourceFactory {

    static create (sourceData) {
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
                            source = new WebSocketSource(sourceData, sourceTypes[0]);
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
        return sourcePool.get(sourceId).disable().then(() => { sourcePool.delete(sourceId); });
    }

    static update (sourceData) {
        return sourcePool.get(sourceData.id).update(sourceData);
    }

    static getHealth (sourceId) {
        return sourcePool.get(sourceId).getHealth();
    }
}

module.exports = SourceFactory;
