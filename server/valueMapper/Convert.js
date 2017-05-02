let constants = require('./constants.json');

class Convert {

    static [constants.convert.TO_STRING] (stringValue) {
        return String(stringValue);
    }

    static [constants.convert.TO_INTEGER] (stringValue) {
        return parseInt(stringValue);
    }

    static [constants.convert.TO_FLOAT] (stringValue) {
        return parseFloat(stringValue);
    }

    static [constants.convert.TO_DATE] (stringValue) {
        return new Date(stringValue);
    }

    static [constants.convert.TO_COMPLEX] (stringValue) {
        return JSON.parse(stringValue);
    }
}

module.exports = Convert;