const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);

describe("Movies Routers Test ", function() {

    // Test GET / to return all movies 
    it ("Should return all movies if GET /", function(done) {
        agent.get('/movies')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err)
                    return done(err);
                
                // should return an array of movies
                Array.isArray(res.body).should.equal(true);
                done();
            });
    });

    it ("Should return a movie with the same id if GET/:id", function(done) {
        agent.get('/movies/0')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err)
                    return done(err);
                // with the same id
                res.body.id.should.equal(0);
                done();
            });
    }); 


    it("Should return 404 if the id do not exist GET/:id", function(done){
        agent.get('/movies/2')
            .expect(404)
            .end(function(err, res) {
                if (err)
                    return done(err);
                res.body.error.includes('found').should.equal(true)
                done();
            })
    });
});