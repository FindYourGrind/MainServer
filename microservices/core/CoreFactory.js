let Core = require('./Core');

let corePool = new Map();

class CoreFactory {

    static create (coreData, callback) {
        corePool.set(coreData.id, new Core(coreData));
        callback();
    }

    static remove (coreId, callback) {
        corePool.get(coreId).remove();
        corePool.delete(coreId);
        callback();
    }

    static update (coreData, callback) {
        corePool.get(coreData.id).update(coreData);
        callback();
    }

    static run (coreId, callback) {
        corePool.get(coreId).run();
        callback();
    }

    static stop (coreId, callback) {
        corePool.get(coreId).stop();
        callback();
    }

    static createInput (inputData, callback) {

        callback();
    }

    static removeInput (inputId, callback) {

        callback();
    }

    static updateInput (inputData, callback) {

        callback();
    }

    static createOutput (outputData, callback) {

        callback();
    }

    static removeOutput (outputId, callback) {

        callback();
    }

    static updateOutput (outputData, callback) {

        callback();
    }
}

module.exports = CoreFactory;
