let Core = require('./Core');

let corePool = new Map();
let inputToCoreMap = new Map();
let outputToCoreMap = new Map();


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
        corePool.get(inputData.coreId).createInput(inputData);
        inputToCoreMap.set(inputData.id, inputData.coreId);
        callback();
    }

    static removeInput (inputId, callback) {
        corePool.get(inputToCoreMap.get(inputId)).removeInput(inputId);
        inputToCoreMap.delete(inputId);
        callback();
    }

    static updateInput (inputData, callback) {
        corePool.get(inputData.coreId).updateInput(inputData);
        callback();
    }

    static createOutput (outputData, callback) {
        corePool.get(outputData.coreId).createOutput(outputData);
        outputToCoreMap.set(outputData.id, outputData.coreId);
        callback();
    }

    static removeOutput (outputId, callback) {
        corePool.get(outputToCoreMap.get(outputId)).removeOutput(outputId);
        outputToCoreMap.delete(outputId);
        callback();
    }

    static updateOutput (outputData, callback) {
        corePool.get(outputData.coreId).updateOutput(outputData);
        callback();
    }
}

module.exports = CoreFactory;
