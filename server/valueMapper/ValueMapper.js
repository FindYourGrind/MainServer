let Convert = require('./Convert');

class ValueMapper {
    static processValue (valueMapper, value) {
        return Convert[valueMapper.__data.convert](value);
    }
}

module.exports = ValueMapper;
