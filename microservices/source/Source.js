class Source {

    constructor(sourceData) {
        this.sourceData = sourceData;
        console.log('create source', sourceData.id);
    }

    run() {
        console.log('run source', this.sourceData.id);
    }

    stop() {
        console.log('stop source', this.sourceData.id);
    }

    update(sourceData) {
        console.log('update source', this.sourceData.id);
    }

    remove () {
        console.log('remove source', this.sourceData.id);
    }
}

module.exports = Source;

