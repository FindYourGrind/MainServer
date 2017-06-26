let _ = require('lodash');
let constants = require('./constants.json');

class Convert {

    static [constants.convert.TO_STRING](stringValue) {
        let result = _.toString(stringValue);

        return (!_.isNil(result) || _.isString(result)) ? result : null;
    }

    static [constants.convert.TO_INTEGER](stringValue) {
        let result = parseInt(stringValue);

        return (!_.isNil(result) || !_.isNaN(result) || _.isInteger(result)) ? result : NaN;
    }

    static [constants.convert.TO_FLOAT](stringValue) {
        let result = _.toNumber(stringValue);

        return (!_.isNil(result) || !_.isNaN(result) || _.isNumber(result)) ? result : NaN;
    }

    static [constants.convert.TO_DATE](stringValue) {
        let result = new Date(stringValue);

        return (!_.isNil(result) || !_.isNaN(result.getTime()) || _.isDate(result)) ? result : null;
    }

    static [constants.convert.TO_COMPLEX](stringValue) {
        let result;

        try {
            result = JSON.parse(stringValue);
        } catch (err) {
            result = null;
        }

        return (!_.isNil(result) || _.isObjectLike(result)) ? result : {};
    }
}

module.exports = Convert;
