const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);
var tokenGenerator = require('../helpers/auth_token');

describe('Sessions CRUD test', function () {
    var User = require('../models/main')('user');
    var Category = require('../models/main')('category');
    var Session = require('../models/main')('session');
    var token = "test2_token";
    var user = null;
    var session_unique = null;

    var category_reference_1 = null;
    var category_reference_2 = null;
    var category_reference_3 = null;

    before(function (done) {
        User.create({
            alias: 'session-test',
            password: '123456789',
            name: 'test_name',
            email: 'testpost@test.com',
            token: "test2_token",
            key: "testkey"
        }).then(function (createdUser) {
            user = createdUser;
            token = token || user.token;
        }).catch(done);

        Category.create({
            name: 'Physics'
        }).then(function (category) {
            category_reference_1 = category;
        }).catch(done);

        Category.create({
            name: 'Dank Memes'
        }).then(function (category) {
            category_reference_2 = category;
        }).catch(done);

        Category.create({
            name: 'Scyfy'
        }).then(function (category) {
            category_reference_3 = category;
            done();
        }).catch(done);
    });

    it('Should create new session when POST /sessions', function (done) {
        agent.post('/sessions')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'Introduction to Dark Matter',
                start: '22:00:00', // has to start late to be dark
                end: '01:00:00', // even darker
                day: '2017-08-22', // 'YYYY-MM-DD'
                type: 'lecture',
                available: false,
                categories: [2, 3] // ids 2, 3 because there was 1 inserted in a test before
            }).expect(201).end(function (err, res) {
                if (err) return done(err);

                Session.find({
                    where: {
                        name: 'Introduction to Dark Matter'
                    }
                }).then(function (session) {
                    session.getCategories().then(function (categories) {
                        session.categories = categories;

                        session.available.should.equal(true);
                        (session.categories.length === 2).should.equal(true);
                        session_unique = session;

                        done();
                    }).catch(done);
                }).catch(done);
            });
    });

    it('Should return all sessions when GET /sessions', function (done) {
        agent.get('/sessions')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                var found = false;

                res.body.forEach((item, index) => {
                    if (item.name === 'Introduction to Dark Matter') {
                        found = true;
                    }
                });

                found.should.equal(true);
                done();
            });
    });

    it('Should update the session when PUT /sessions', function (done) {
        agent.put('/sessions/' + session_unique.id)
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'Introduction to Dank Matter',
                categories: [4]
            })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                Session.findOne({
                    where: {
                        id: session_unique.id
                    }
                }).then(function (session) {
                    session.getCategories().then(function (categories) {
                        session.categories = categories;

                        session.name.should.equal('Introduction to Dank Matter');
                        (session.categories[0].id == 4).should.equal(true);

                        done();
                    }).catch(done);
                }).catch(done);
            });
    });

    it('Should delete sessio when DELETE /sessions', function (done) {
        agent.delete("/sessions/" + session_unique.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                Session.findOne({
                    where: {
                        id: session_unique.id
                    }
                }).then(function (session) {
                    (session == null).should.equal(true);
                    done();
                }).catch(done);
            });
    });

    after(function (done) {
        user.destroy().then(function () {
            if (session_unique) session_unique.destroy();
            if (category_reference_1) category_reference_1.destroy();
            if (category_reference_2) category_reference_2.destroy();
            if (category_reference_3) category_reference_3.destroy().then(done());
        });
    });
});