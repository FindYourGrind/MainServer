let Source = require('./Source');

let sourcePool = new Map();

class SourceFactory {

    static create (sourceData, callback) {
        sourcePool.set(sourceData.id, new Source(sourceData));
        callback();
    }

    static remove (sourceId, callback) {
        sourcePool.delete(sourceId);
        callback();
    }

    static update (sourceData, callback) {
        sourcePool.get(sourceData.id).update(sourceData);
        callback();
    }

    static run (sourceId, callback) {
        sourcePool.get(sourceId).run();
        callback();
    }

    static stop (sourceId, callback) {
        sourcePool.get(sourceId).stop();
        callback();
    }
}

module.exports = SourceFactory;
