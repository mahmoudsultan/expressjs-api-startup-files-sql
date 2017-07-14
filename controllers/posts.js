var Post = require('../models/main')('posts');

// GET posts/
function index(req, res) {
    Post.findAll().then(function (posts) {
        res.status(200).send(posts).end();
    }).catch(function (err) {
        res.status(500).send(err).end()
    })
}

// GET posts/show/:id gets the information of a post
function show(req, res) {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id','content','user_id']
    }).then(function (post) {
        if (!post) {
            // user not found send 404
            res.status(404).end();
        } else {
            res.status(200).send(post).end();
        }
    }).catch(function (err) {
        res.status(500).send({
            error: err
        }).end();
    })
}

function post(req,res){
    var content = req.body.content;
    var user_id = req.body.user_id;
    Post.create({content: content, user_id: user_id}).then(function (post) {
        res.status(201).send(post).end();
    }).catch(function (err) {
        res.status(400).send({error: err.message}).end();
    });
}


module.exports = {
    index: index,
    show: show,
    post: post
};