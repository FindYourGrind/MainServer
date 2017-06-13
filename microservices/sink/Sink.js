class Sink {

    constructor(sinkData) {
        this.sinkData = sinkData;
        console.log('create sink', sinkData.id);
    }

    run() {
        console.log('run sink', this.sinkData.id);
    }

    stop() {
        console.log('stop sink', this.sinkData.id);
    }

    update(sinkData) {
        console.log('update sink', this.sinkData.id);
    }

    remove () {
        console.log('remove sink', this.sinkData.id);
    }
}

module.exports = Sink;

