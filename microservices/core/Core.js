class Core {

    constructor(coreData) {
        this.coreData = coreData;
        this.inputDataList = new Map();
        this.outputDataList = new Map();

        console.log('create core', coreData.id);
    }

    run() {
        console.log('run core', this.coreData.id);
    }

    stop() {
        console.log('stop core', this.coreData.id);
    }

    update(coreData) {
        console.log('update core', this.coreData.id);
    }

    remove () {
        console.log('remove core', this.coreData.id);
    }

    createInput (inputData) {
        console.log('create input', this.coreData.id, inputData.id);
    }

    removeInput (inputId) {
        console.log('remove input', this.coreData.id, inputId);
    }

    updateInput (inputData) {
        console.log('update input', this.coreData.id, inputData.id);
    }

    createOutput (outputData) {
        console.log('create output', this.coreData.id, outputData.id);
    }

    removeOutput (outputId) {
        console.log('remove output', this.coreData.id, outputId);
    }

    updateOutput (outputData) {
        console.log('update output', this.coreData.id, outputData.id);
    }


}

module.exports = Core;

