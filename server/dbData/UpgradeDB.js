let app = require('../server');
let accountData = require('./Account.json');
let sourceWorkerTypeData = require('./SourceWorkerType.json');
let valueMapperData = require('./ValueMapper.json');

function fillModel (modelName, data) {
    let Model = app.models[modelName];

    return new Promise(function (resolve, reject) {
        Model.create(data, function (err, models) {
            if (err) {
                reject(err);
            } else {
                console.log(modelName + 's was created');
                resolve(models);
            }
        });
    });
}

class UpgradeDB {
    static fillData () {
        return new Promise(function (resolve, reject) {
            fillModel('Account', accountData)
                .then(() => fillModel('SourceWorkerType', sourceWorkerTypeData))
                .then(() => fillModel('ValueMapper', valueMapperData))
                .then(resolve)
                .catch((err) => {
                    console.log('Error while filling data - ' + err);
                    reject(err);
                });
        });
    }
}

module.exports = UpgradeDB;