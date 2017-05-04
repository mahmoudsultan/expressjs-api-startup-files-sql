const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const config = require('./config');
const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const strategySetup = require('./helpers/auth_setup');


// Routers importing
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const notificationsRouter = require('./routes/notifications');

/* Database and models setup */
const connection = require('./models/main')('connection');
const User = require('./models/main')('users');

// force: true here is only in the development env change in config.js
connection.sync({
    force: config.force
}).then(function () {
    console.log('Database created succesfully...');
    return User.create({
        alias: "test",
        password: "123456789",
        name: "test",
        email:  "test@test.com"
    })
}).then(function (user) {
    console.log("User created successfully");
}).catch(console.log);

// setup the body parser middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

// authentication setup
app.use(passport.initialize());
passport.use(strategySetup(Strategy));


// routers setup
app.use(function (req, res, next) {
    var method = req.method;
    console.log(method, " request to: ", req.url);
    next();
});


// Routers setup
// authentication required for the movies route
app.use('/movies', passport.authenticate('bearer', {
    session: false
}), moviesRouter);

app.use('/users', usersRouter);

// TODO: important need authentication for the admin route
app.use('/admin', adminRouter);

// app.get('/', function(req, res) {
//     res.status(200).sendFile("index.html");
// });

app.get('/notification', function(req, res) {
    res.status(200).sendFile(__dirname +"/public/not.html");
});

app.get('/admin/notify', function(req, res) {
    res.status(200).sendFile(__dirname + "/public/notifications.html");
})

app.use('/notify', notificationsRouter);

app.get('*', function (req, res) {
    res.status(404).end();
    // Add 404 page if applicable
});

var port = process.env.PORT || config.port;
app.listen(port, function () {
    console.log('Server running on port: ', port);
});