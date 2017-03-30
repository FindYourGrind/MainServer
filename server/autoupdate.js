let server = require('./server');
let ds = server.dataSources.pg;
let lbTables = [
  'User',
  'ACL',
  'RoleMapping',
  'Role',
  'Account',
  'SensorType',
  'Workspace',
  'Core',
  'Sink',
  'Source',
];

ds.isActual(lbTables, function(err, actual) {
  if (!actual) {
    ds.autoupdate(lbTables, function(err, result) {
      console.log(result);
    });
  }
});
