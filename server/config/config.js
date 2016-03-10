var path = require('path'),
           rootPath = path.normalize(__dirname + '/../../'),
           secrets = require('../../secrets');

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost/telerik',
        port: process.env.PORT || 3030
    },
    production: {
        rootPath: rootPath,
        db: secrets.productionConnectionString,
        port: process.env.PORT || 3030
    }
}