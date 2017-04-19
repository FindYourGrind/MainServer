let server = require('./server');
let ds = server.dataSources.pg;
let pgTables = server.models()
    .filter(function (model) {

      return model.dataSource && model.dataSource.name === ds.name;
    })
    .map(function (model) {
      return model.modelName;
    });


pgTables.forEach(function (modelName) {
    ds.isActual(modelName, function(err, actual) {
        if (!actual) {
            ds.autoupdate(modelName, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(modelName, "updated");
                }
            });
        }
    });
});
