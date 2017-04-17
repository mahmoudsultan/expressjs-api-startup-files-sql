const Sequelize = require('sequelize'),
    config = require('./../config');

var connection = new Sequelize(config.database.name, config.database.username,
    config.database.password, config.database.config);

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