const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);
var tokenGenerator = require('../helpers/auth_token');

describe("Posts CRUD test", function() {
    var User = require('../models/main')('users');
    var Post = require('../models/main')('posts');
    var user = null;
    var token = "test2_token";
    var postG = null;

    before(function(done) {
        User.create({
            alias: 'post-test',
            password: '123456789',
            name: 'test_name',
            email: 'testpost@test.com',
            token: "test2_token",
            key: "testkey"
        }).then(function (createdUser) {
            user = createdUser;
            token = token || user.token;
            done();
        }).catch(done);
    })

    it ("Should create new post when POST /posts", function(done) {
        agent.post('/posts')
            .set('Authorization', 'Bearer ' + token)
            .send({
                content: "post content test",
            }).expect(201).end(function(err, res) {
                if (err) return done(err);
                Post.findOne({
                    where: {
                        user_id: user.id
                    }
                }).then(function(post) {
                    (post == null).should.equal(false);
                    (post.content == "post content test").should.equal(true);
                    postG = post;
                    done();
                }).catch(done);
            });
    });

    it ("Should return all posts when GET /posts", function(done) {
        agent.get('/posts/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                found = false;
                res.body.forEach((item, index) => {
                    if (item.content.includes("test")) {
                        found = true;
                    }
                })
                found.should.equal(true);
                // console.log(res.body);
                done();
            })
    });

    it ("Should update the post if the user_id is valid", function(done) {
        agent.put('/posts/'+postG.id)
            .set('Authorization', 'Bearer ' + token)
            .send({content: "new test content"})
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                Post.findOne({
                    where: {
                        id: postG.id
                    }
                }).then(function(post) {
                    post.content.should.equal("new test content");
                    done();
                }).catch(done);
            });
    });

    it ("Should not update the post if the user is not the owner", function(done) {
        // TODO
        done();
    })

    it ("Should delete post if user is owner", function(done) {
        agent.delete("/posts/" + postG.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
                if (err) done(err);
                Post.findOne({
                    where: {
                        id: postG.id
                    }
                }).then(function(post) {
                    console.log(post);
                    (post == null).should.equal(true);
                    done();
                }).catch(done);
            });
    });


    after(function (done) {
        user.destroy().then(function() {
            if (postG) postG.destroy().then(done());
        });
    });

});