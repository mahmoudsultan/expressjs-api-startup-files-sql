// movies for now until we setup the database

var Movies = require('./../models/main')('movies');

var index = function (req, res) {
    var movies = Movies.findAll().then(function (movies) {
        res.status(200).send(movies);
        res.end()
    });
};

var show = function (req, res) {
    var id = req.params.id;
    // if (movies[id] === undefined) {
    //     res.status(404).send({error: "Movie not found."});
    // } else {
    //     res.status(200).send(movies[id]);
    // }
    Movies.findById(id).then(function (movie) {
        if (movie === null) {
            res.status(404).send({ error: "Movie not found" }).end();
        } else {
            res.send(movie).end();
        }
    }).catch(function (error) {
        res.status(400).send({ error: error }).end();
    });
};

var post = function (req, res) {
    var title = req.body.title;
    var desc = req.body.description;
    Movies.create({ title: title, description: desc }).then(function (movie) {
        res.status(201).end();
    }).catch(function (err) {
        res.status(400).send({ error: err.message }).end();
    });
};

module.exports = {
    index: index,
    show: show,
    post: post
};