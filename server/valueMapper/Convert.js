let _ = require('lodash');
let constants = require('./constants.json');

class Convert {

    static [constants.convert.TO_STRING] (stringValue) {
        return new Promise((resolve, reject) => {
            let result = _.toString(stringValue);

            _.isString(result) ? resolve(result) : reject('Error convert ' + constants.convert.TO_STRING);
        });
    }

    static [constants.convert.TO_INTEGER] (stringValue) {
        return new Promise((resolve, reject) => {
            let result = _.toSafeInteger(stringValue);

            _.isSafeInteger(result) ? resolve(result) : reject('Error convert ' + constants.convert.TO_INTEGER);
        });
    }

    static [constants.convert.TO_FLOAT] (stringValue) {
        return new Promise((resolve, reject) => {
            let result = _.toNumber(stringValue);

            _.isNumber(result) ? resolve(result) : reject('Error convert ' + constants.convert.TO_FLOAT);
        });
    }

    static [constants.convert.TO_DATE] (stringValue) {
        return new Promise((resolve, reject) => {
            let result = new Date(stringValue);

            _.isDate(result) ? resolve(result) : reject('Error convert ' + constants.convert.TO_DATE);
        });
    }

    static [constants.convert.TO_COMPLEX] (stringValue) {
        return new Promise((resolve, reject) => {
            let result = JSON.parse(stringValue);

            _.isObjectLike(result) ? resolve(result) : reject('Error convert ' + constants.convert.TO_COMPLEX);
        });
    }
}

module.exports = Convert;
