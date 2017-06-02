let Source = require('./Source');

let sourcePool = new Map();

class SourceFactory {

    static create (sourceData) {
        sourcePool.set(sourceData.id, new Source(sourceData));
    }

    static remove (sourceId) {
        sourcePool.delete(sourceId);
    }

    static update (sourceData) {
        sourcePool.get(sourceData.id).update(sourceData);
    }

    static run (sourceId) {
        sourcePool.get(sourceId).run();
    }

    static stop (sourceId) {
        sourcePool.get(sourceId).stop();
    }
}

module.exports = SourceFactory;
