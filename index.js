const express = require('express');
const app = express();
const envconfig = require('dotenv').config();
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
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtags');
const sponsorsRouter = require('./routes/sponsors');
const categoriesRouter = require('./routes/categories');
const sessionsRouter = require('./routes/sessions')

/* Database and models setup */
const connection = require('./models/main')('connection');
const User = require('./models/main')('user');
const Post = require('./models/main')('post');
const Hashtag = require('./models/main')('hashtag');
const Sponsor = require('./models/main')('sponsor');
const Category = require('./models/main')('category');
const Session = require('./models/main')('session');

// force: true here is only in the development env change in config.js
connection.sync({
    force: config.force
}).then(function () {
    console.log('Database created succesfully...');
    // For Testing
    User.create({
        alias: "test",
        password: "123456789",
        name: "test",
        email: "test@test.com"
    }).then(function (user) {
        console.log("User created successfully");
        Post.create({
            content: "initial topic",
        }).then(function (post) {
            Hashtag.create({
                title: "test",
            }).then((hashtag) => {
                hashtag.setPosts([post]);
                return user.setPosts([post]);
            });
        })
    }).catch(console.log)
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
app.use('/movies',
    // passport.authenticate('bearer', {
    // session: false
    // }),
    moviesRouter);

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/hashtags', hashtagRouter);
app.use('/sponsors', sponsorsRouter);
app.use('/categories', categoriesRouter);
app.use('/sessions', sessionsRouter);

// TODO: important need authentication for the admin route
app.use('/admin', adminRouter);

// app.get('/', function(req, res) {
//     res.status(200).sendFile("index.html");
// });

app.get('/notification', function (req, res) {
    res.status(200).sendFile(__dirname + "/public/not.html");
});

app.get('/admin/notify', function (req, res) {
    res.status(200).sendFile(__dirname + "/public/notifications.html");
})


app.get('*', function (req, res) {
    res.status(404).end();
    // Add 404 page if applicable
});

var port = process.env.PORT || config.port;
app.listen(port, function () {
    console.log('Server running on port: ', port);
});