let Sink = require('./Sink');

let sinkPool = new Map();

class SinkFactory {

    static create (sinkData, callback) {
        sinkPool.set(sinkData.id, new Sink(sinkData));
        callback();
    }

    static remove (sinkId, callback) {
        sinkPool.get(sinkId).remove();
        sinkPool.delete(sinkId);
        callback();
    }

    static update (sinkData, callback) {
        sinkPool.get(sinkData.id).update(sinkData);
        callback();
    }

    static run (sinkId, callback) {
        sinkPool.get(sinkId).run();
        callback();
    }

    static stop (sinkId, callback) {
        sinkPool.get(sinkId).stop();
        callback();
    }
}

module.exports = SinkFactory;
