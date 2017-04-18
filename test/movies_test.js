const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);

describe("Movies Routers Test ", function () {

    var Movie = require('../models/main')('movies');

    describe("GET Request", (done) => {
        // Test GET / to return all movies 

        before(done => {
            Movie.create({
                title: "test movie title",
                description: "test movie description"
            });
            done();
        });

        it("Should return all movies if GET /", function (done) {
            agent.get('/movies')
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
                console.log(movie.id);
                agent.get('/movies/' + movie.id)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        // with the same id
                        res.body.id.should.equal(movie.id);
                        done();
                    });
            });
        });


        it("Should return 404 if the id do not exist GET/:id", function (done) {
            var movie = Movie.findOne({
                limit: 1,
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            agent.get('/movies/' + (movie.id + 1))
                .expect(404)
                .end(function (err, res) {
                    if (err)
                        return done(err);
                    res.body.error.includes('found').should.equal(true)
                    done();
                });
        });
    })

});