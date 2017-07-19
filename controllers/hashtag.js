var Hashtag = require('../models/main')('hashtag');
var Post = require('../models/main')('posts');

var parallel = require('async/parallel');

function index(req, res) {
    var page = req.params.page || 0;
    var limit = req.params.limit || 10;
    var offset = page * limit;

    Hashtag.findAll({
        offset: offset,
        limit: limit
    }).then(function (hashtags) {
        res.status(200).send(hashtags).end();
    }).catch(function (err) {
        res.status(500).send({error: err.message}).end();
    });
}

function create(req, res) {
    Hashtag.create({
        title: req.body.title
    }).then(function (hashtag) {
        if (!hashtag) res.status(400).end();
        res.status(201).send(hashtag).end();
    }).catch(function(err) {
        res.status(500).send({error: err.message}).end();
    });
}

/*
    GET /hashtag/:title
    load information of the hashtag and the post with that
    hashtag
*/
function show(req, res) {
    var title = req.params.title;

    Hashtag.findOne({
        where: {
            title: title
        },
        include: [{
            model: Post, as: "posts"
        }]
    }).then(function (hashtag) {
        if (!hashtag) res.status(404).end();
        res.status(200).send(hashtag).end();
    }).catch(function (error) {
        res.status(500).send({error: err.message}).end();
    });
}

function createAndLinkToPost(title, post, callbackOut) {
    Hashtag.findOrCreate({
        where: {
            title: title
        }
    }).spread(function(hashtag, created) {
        async.parallel([
            function(callback) {
                hashtag.addPost(post).then(() => {
                callback();
            })
        },
            function(callback) {
                post.addHashtag(hashtag).then(() => {
                    callback();
                })
            }
        ], function(err, results) {
            if (err) {
                callbackOut(err);
            } else {
                callbackOut();
            }
        })
    });
}

function count(req, res) {
    Hashtag.findOne({
        where:{
            title: req.params.title
        }
    }).then((hashtag) => {
        if (!hashtag) res.status(404).end();
        return hashtag.getPosts().then((posts) => {
            res.status(200).send({count: posts.length}).end()
        })
    }).catch((err) => {
        res.status(500).send({error: err.message}).end();
    })
}

module.exports = {
    index: index,
    show: show,
    create: create,
    createAndLinkToPost: createAndLinkToPost,
    count: count
}