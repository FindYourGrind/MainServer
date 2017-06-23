let Convert = require('./Convert');

class ValueMapper {
    static processValue (valueMapper, value) {
        return new Promise((resolve, reject) => {
            let result = Convert[valueMapper.__data.convert](value);

            result.success ? reject(result.value) : resolve('Error while converting raw value');
        });
    }
}

module.exports = ValueMapper;
