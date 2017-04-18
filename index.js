const express = require('express');
const app = express();
const moviesRouter = require('./routes/movies'),
    bodyParser = require('body-parser'),
    Sequelize = require('sequelize'),
    connection = require('./models/main')('connection'),
    config = require('./config');

/* Database and models setup */

// force: true here is only in the development env change in config.js
connection.sync({force: config.force}).then(function() {
    console.log('Database created succesfully...');
});

// setup the body parser middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.use(function(req, res, next) {
    var method = req.method;
    console.log(method, " request to: ", req.url);
    next();
});

app.use('/movies', moviesRouter);

// app.get('/', function(req, res) {
//     res.status(200).sendFile("index.html");
// });

app.get('*', function(req, res) {
    res.status(404).end();
    // Add 404 page if applicable
});

var port = process.env.PORT || config.port;
app.listen(port, function() {
    console.log('Server running on port: ', port);
});