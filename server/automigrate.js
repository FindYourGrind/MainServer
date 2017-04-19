let server = require('./server');
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
    ds.disconnect();
});
