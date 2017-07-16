var Hashtag = require('../models/main')('hashtag');
var Post = require('../models/main')('posts');

// GET /hashtags    
function index(req, res) {
    Hashtag.findAll().then(function(hastags) {
        res.status(200).send(hashtags).end();
    }).catch(function (err) {
        res.status(500).send({error: err}).end();
    });
}

// GET /hashtag/:id gets the information of a hashtag
function show(req, res) {
    Hashtag.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (hashtag) {
        if (!hashtag) {
            res.status(404).end();
        } else {
            res.status(200).send(hashtag).end();
        }
    }).catch(function (err) {
        res.status(500).send({
            error: err
        }).end();
    });
}

/*
    Create new hashtag 
    POST /hashtags
    the request: 
    {
        title: hashtag title
    }

    TODO ×
*/
function create(req, res) {
    var title = req.body.title;

    Hashtag.create({title: title}).then(function(hashtag) {
        res.status(201).send(hashtag).end();
    }).catch(function (err) {
        console.log(err.message);
        res.status(500).send({error: err.message}).end();
    });
}


function createAndLink(title, post, callback) {
    Hashtag.create({
        title: title
    }).then(function (hashtag) {

    })
}


module.exports = {
    index: index,
    show: show,
    create: create
}