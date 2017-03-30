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

ds.automigrate(lbTables, function(er) {
    if (er) {
        console.log('Error:', er);
        throw er;
    }
    console.log('Loopback tables', lbTables, 'created in', ds.adapter.name);
    ds.disconnect();
});
