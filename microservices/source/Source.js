class Source {
    constructor(sourceData, sourceType, notificationCallback) {
        let me = this;

        me.health = false;
        me.sourceData = sourceData;
        me.sourceType = sourceType;
        me.notificationCallback = notificationCallback;
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

    notifyInputs (data) {
        let me = this;

        if (me.notificationCallback) {
            me.notificationCallback(data, me.sourceData.inputIdList);
        }
    }
}

module.exports = Source;

