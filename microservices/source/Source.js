class Source {
    constructor(sourceData, sourceType) {
        let me = this;

        me.health = false;
        me.sourceData = sourceData;
        me.sourceType = sourceType;
    }

    init () {
        return new Promise((resolve, reject) => {
            reject('Init method should be implemented');
        });
    }

    enable () {
        return new Promise((resolve, reject) => {
            reject('Enable method should be implemented');
        });
    }

    disable () {
        return new Promise((resolve, reject) => {
            reject('Disable method should be implemented');
        });
    }

    update (sourceData) {
        let me = this;

        return me.disable()
            .then(() => {
                me.sourceData = sourceData;
                return me.init();
            });
    }

    getHealth () {
        let me = this;
        return me.health;
    }

    notifyInputs () {

    }
}

module.exports = Source;

