let Source = require('./Source');

class TimerSource extends Source {

    constructor () {
        super(...arguments);

        this.timerId = null;
    }

    init () {
        let me = this;

        return new Promise ((resolve, reject) => {
            me.enable().then(resolve).catch(reject);
        });
    }

    enable () {
        let me = this;
        let sourceData = me.sourceData;

        return new Promise ((resolve, reject) => {
            if (sourceData.connected === true) {
                me.timerId = setTimeout(function timeOutHandler() {
                    me.notifyInputs('timeout');
                    me.timerId = setTimeout(timeOutHandler, sourceData.workerConfig.counter);
                }, sourceData.workerConfig.counter);

                me.health = true;
            }

            resolve();
        });
    }

    disable () {
        let me = this;

        return new Promise ((resolve, reject) => {
            clearTimeout(me.timerId);

            me.timerId = null;
            me.health = false;

            resolve();
        });
    }
}

module.exports = TimerSource;
