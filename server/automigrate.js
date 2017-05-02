let server = require('./server');
let UpgradeDB = require('./dbData/UpgradeDB');

let ds = server.dataSources.pg;
let pgTables = server.models()
  .filter(function (model) {
    return model.dataSource && model.dataSource.name === ds.name;
  })
  .map(function (model) {
    return model.modelName;
  });

ds.automigrate(pgTables, function(er) {
    if (er) {
        console.log('Error:', er);
        throw er;
    }

    console.log('Loopback tables', pgTables, 'created in', ds.adapter.name);

    UpgradeDB.fillData()
        .then(() => {
            console.log('DB data filled');
            ds.disconnect();
            process.exit(0);
        })
        .catch((err) => {
            console.log(err);
            ds.disconnect();
            process.exit(0);
        });
});
