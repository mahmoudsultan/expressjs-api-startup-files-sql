const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);
var tokenGenerator = require('../helpers/auth_token');

describe("Movies Routers Test ", function () {

    var connection = require('../models/main')('connection');
    var Movie = require('../models/main')('movies');
    var User = require('../models/main')('user');
    var user = null;

    describe("GET Request", (done) => {
        // Test GET / to return all movies 

        before(done => {
            Movie.create({
                title: "test movie title2",
                description: "test movie description"
            }).then(function () {
                return User.create({
                    alias: "test-user2",
                    name: 'test_name',
                    email: 'test@test.com',
                    password: "123456789",
                    token: 'tokentest'
                });
            }).then(createdUser => {
                user = createdUser;
                done()
            }).catch(done);
        });

        it("Should return all movies if GET /", function (done) {
            agent.get('/movies')
                .set('Authorization', 'Bearer tokentest')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err)
                        return done(err);
                    // should return an array of movies
                    Array.isArray(res.body).should.equal(true);
                    done();
                });
        });

        it("Should return a movie with the same id if GET/:id", function (done) {
            Movie.findOne({
                limit: 1,
                order: [
                    ['createdAt', 'desc']
                ]
            }).then(movie => {
                // console.log(movie.id);
                agent.get('/movies/' + movie.id)
                    .set('Authorization', 'Bearer tokentest')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        // with the same id
                        res.body.id.should.equal(movie.id);
                        done();
                    });
            }).catch(done);
        });


        it("Should return 404 if the id do not exist GET/:id", function (done) {
            var movie = Movie.findOne({
                limit: 1,
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            agent.get('/movies/' + (movie.id + 1))
                .set('Authorization', 'Bearer tokentest')
                .expect(404)
                .end(function (err, res) {
                    if (err)
                        return done(err);
                    res.body.error.includes('found').should.equal(true)
                    done();
                });
        });
    })

    after(function (done) {
        Movie.destroy({
            where: {
                title: 'test movie title2'
            }
        }).then(function () {
            return user.destroy()
        }).then(done());
    })
});