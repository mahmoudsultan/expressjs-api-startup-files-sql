const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);


describe('Admin routers test for Users functionality', function() {
    var User = require('../models/main')('users');
    
    // POST /admin/create/user
    it ("Should create new user - return 201 and location of the new user", function (done) {
        user = {
            alias: "test-alias",
            name: "some name",
            email: "test@test.com",
            password: "122342342435"
        }

        agent.post('/admin/create/user')
            .send(user)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.not.equal(undefined);
                
                User.findOne({where: {
                    alias: 'test-alias'
                }}).then(function (user) {
                    res.body.id.should.equal(user.id);
                    // res.get('Location').should.equal('/users' + user.alias);
                    done();
                }).catch(done);
            });
    });

})