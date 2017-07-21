const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);
var tokenGenerator = require('../helpers/auth_token');

describe('Sponsors CRUD test', function () {
    var User = require('../models/main')('users');
    var Sponsors = require('../models/main')('sponsors');
    var token = "test2_token";
    var user = null;
    var sponsor_unique = null;

    before(function (done) {
        User.create({
            alias: 'sponsor-test',
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

    it('Should create new sponsor when POST /sponsors', function (done) {
        agent.post('/sponsors')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'Vodafone',
                link: 'http://www.vodafone.com.eg/',
                type: 'Gold'
            }).expect(201).end(function (err, res) {
                if (err) return done(err);

                Sponsors.findOne({
                    where: {
                        name: 'Vodafone'
                    }
                }).then(function (sponsor) {
                    (sponsor == null).should.equal(false);
                    (sponsor.type == 'Gold').should.equal(true);
                    sponsor_unique = sponsor;
                    done();
                }).catch(done);
            });
    });

    it('Should return all sponsors when GET /sponsors', function (done) {
        agent.get('/sponsors')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                var found = false;

                res.body.forEach((item, index) => {
                    if (item.name === 'Vodafone') {
                        found = true;
                    }
                });

                found.should.equal(true);
                done();
            });
    });

    it('Should update the sponsor when PUT /sponsors', function (done) {
        agent.put('/sponsors/' + sponsor_unique.id)
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Voda' })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                Sponsors.findOne({
                    where: {
                        id: sponsor_unique.id
                    }
                }).then(function (sponsor) {
                    sponsor.name.should.equal('Voda');
                    done();
                }).catch(done);
            });
    });

    it('Should delete sponsor when DELETE /sponsors', function (done) {
        agent.delete("/sponsors/" + sponsor_unique.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                Sponsors.findOne({
                    where: {
                        id: sponsor_unique.id
                    }
                }).then(function (sponsor) {
                    (sponsor == null).should.equal(true);
                    done();
                }).catch(done);
            });
    });

    after(function (done) {
        user.destroy().then(function () {
            if (sponsor_unique) sponsor_unique.destroy().then(done());
        });
    });
});