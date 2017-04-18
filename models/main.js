const Sequelize = require('sequelize'),
    config = require('./../config');

// this is for deployment in heroku
if (process.env.DATABASE_URL) {

    var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    var connection = new Sequelize(match[5], match[1], match[2], {
        dialect: 'postgres', 
        protocol: 'postgres',
        port: match[4],
        host: match[3],
        logging: false,
        dialectOptions: {
            ssl: true
        }
    });
    
} else {
    var connection = new Sequelize(config.database.name, config.database.username,
        config.database.password, config.database.config);
}

var Movies = connection.import(__dirname + '/movies.js');

// if there's any relations put it here

// setup the array of modules
var modules = {
    connection: connection,
    movies: Movies
};

module.exports = function(name) {
    return modules[name];
};