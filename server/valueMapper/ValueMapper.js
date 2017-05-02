let app = require('../server');
let Convert = require('./Convert');
let constants = require('./constants.json');

class ValueMapper {

    static processInputsValues (inputIdList) {
        let me = this;
        let InputModel = app.models.Input;
        let ValueMapperModel = app.models.ValueMapper;
        let logger = app.logger;

        return new Promise(function (resolve, reject) {
            InputModel.find({ where: { id: {inq: { inputIdList } } }, include: [''] })
                .then(function (inputRecords) {

                })
                .catch(function (err) {
                   logger.error('Error while converting Inputs: ' + inputIdList + ' values - ' + err)
                });
        });
    }

    static getInputUpdateEventName (inputId) {
        return 'input-' + inputId + '-value-updated';
    }
}

module.exports = ValueMapper;