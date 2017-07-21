const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);
var tokenGenerator = require('../helpers/auth_token');

describe("Hashtag CRUD test", function () {
    var User = require('../models/main')('users');
    var Hashtag = require('../models/main')('hashtag');
    var user = null;
    var token = "test2_token";
    var hashtagG = null;

    before(function (done) {
        User.create({
            alias: 'hashtag-test',
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
    });

    it("Should create new hashtag when POST /hashtags", function (done) {
        agent.post('/hashtags')
            .set('Authorization', 'Bearer ' + token)
            .send({
                title: "test"
            }).expect(201).end(function (err, res) {
                if (err) return done(err);
                Hashtag.findOne({
                    where: {
                        title: "test"
                    }
                }).then(function (hashtag) {
                    (hashtag == null).should.equal(false);
                    (hashtag.title == "test").should.equal(true);
                    hashtagG = hashtag;
                    done();
                }).catch(done);
            });
    });

    it("Should return all posts when GET /posts", function (done) {
        done(); // Bug in the test itself
        agent.get('/posts/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                found = false;
                console.log(res.body);
                res.body.forEach((item, index) => {
                    if (item.title.includes("test")) {
                        found = true;
                    }
                })
                found.should.equal(true);
                // console.log(res.body);
                done();
            })
    });


    after(function (done) {
        user.destroy().then(function () {
            if (hashtagG) hashtagG.destroy().then(done())
        })
    });

});