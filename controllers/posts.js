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

/*
    Create new post 
    POST /posts
    the request: 
    {
        content: post content
    }
*/
function create(req,res){
    var content = req.body.content;
    
    Post.create({content: content, user_id: req.user.id}).then(function (post) {
        res.status(201).send(post).end();
    }).catch(function (err) {
        res.status(400).send({error: err.message}).end();
    });
}


function update(req, res) {
    var postId = req.params.id;
    Post.findOne({
        where: {
            id: postId
        }
    }).then(function(post) {
        if (!post) res.status(404).end(); 

        if (post.user_id !== req.user.id) {
            res.status(304).end();
        } else {
            post.update(req.body, {
                fields: ['content']
            }).then(function(post) {
                res.status(200).send(post).end();
            }).catch(function(err) {
                // console.log(err);
                res.status(500).send({
                    error: err
                }).end();
            });
        }
    }).catch(function(err) {
        res.status(500).send({
            error: err
        }).end();
    });
}

function destroy(req, res) {
    postId = req.params.id;
    Post.findOne({
        where: {
            id: postId
        }
    }).then(function(post) {
        if (!post) res.status(404).end();
        if (post.user_id !== req.user.id) {
            res.status(304).end();
        } else {
            // Post.destory({
            //     where: {
            //         id: postId
            //     }
            // })
            post.destroy().then(function() {
                res.status(200).end();
            }).catch(function(err) {
                res.status(500).send({
                    error: err
                }).end();
            });
        }
    }).catch(function(err) {
        res.status(500).end();
    });
}

module.exports = {
    index: index,
    show: show,
    post: create,
    update: update,
    destroy: destroy
};