const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);
var tokenGenerator = require('../helpers/auth_token');

describe("Users Routers Test", function () {

    var User = require('../models/main')('users');
    var user = null;
    var token = null;

    before(function (done) {
        User.create({
            alias: 'test2',
            password: '123456789',
            name: 'test_name',
            email: 'test@test.com'
        }).then(function (createdUser) {
            user = createdUser;
            done()
        }).catch(done)
    });

    it("should return the user when GET /show/:alias", function (done) {
        agent.get('/users/' + user.alias)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.alias.should.equal(user.alias);
                ('email' in res.body).should.be.true();
                done()
            });
    });

    // POST /users/login
    it("should login if given the right alias and password", function (done) {
        agent.post("/users/login")
            .send({
                alias: "test2",
                password: "123456789"
            })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                User.findOne({
                    where: {
                        alias: "test2"
                    }
                }).then(user => {
                    res.get('Authorization').should.equal("Bearer " + user.token);
                    token = user.token;
                    done();
                }).catch(done);
            });
    });

    // POST /users/login
    it("should return 404 if the user not found", function (done) {
        agent.post("/users/login")
            .send({
                alias: "invalidname",
                password: "123456789"
            })
            .expect(404)
            .end(done);
    });

    // POST /users/login
    it("should return 400 if the password is wrong", function (done) {
        agent.post('/users/login')
            .send({
                alias: "test2",
                password: "1244412"
            })
            .expect(400)
            .end(function (err, res) {
                res.body.error.includes('incorrect').should.equal(true);
                done();
            })
    });

    // POST /users/logout
    it("should logout by changin the token", function (done) {
        agent.post('/users/logout')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
                User.findOne({
                    where: {
                        alias: "test2"
                    }
                }).then(user => {
                    new_token = user.token;
                    console.log(new_token);
                    console.log(token);
                    (token !== new_token).should.equal(true);
                    done();
                }).catch(done);
            });
    });

    after(function (done) {
        user.destroy().then(done());
    })
});