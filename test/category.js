const supertest = require('supertest'),
    should = require('should');

var port = process.env.PORT || 8000;
var agent = supertest.agent('http://localhost:' + port);
var tokenGenerator = require('../helpers/auth_token');

describe('Categories CRUD test', function () {
    var User = require('../models/main')('user');
    var Category = require('../models/main')('category');
    var token = "test2_token";
    var user = null;
    var category_unique = null;

    before(function (done) {
        User.create({
            alias: 'category-test',
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

    it('Should create new category when POST /categories', function (done) {
        agent.post('/categories')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'Computer'
            }).expect(201).end(function (err, res) {
                if (err) return done(err);

                Category.findOne({
                    where: {
                        name: 'Computer'
                    }
                }).then(function (category) {
                    (category == null).should.equal(false);
                    category_unique = category;
                    done();
                }).catch(done);
            });
    });

    it('Should return all categories when GET /categories', function (done) {
        agent.get('/categories')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                var found = false;

                res.body.forEach((item, index) => {
                    if (item.name === 'Computer') {
                        found = true;
                    }
                });

                found.should.equal(true);
                done();
            });
    });

    it('Should update the cateogry when PUT /categories', function (done) {
        agent.put('/categories/' + category_unique.id)
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Comp' })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                Category.findOne({
                    where: {
                        id: category_unique.id
                    }
                }).then(function (category) {
                    category.name.should.equal('Comp');
                    done();
                }).catch(done);
            });
    });

    it('Should delete category when DELETE /categories', function (done) {
        agent.delete("/categories/" + category_unique.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                Category.findOne({
                    where: {
                        id: category_unique.id
                    }
                }).then(function (category) {
                    (category == null).should.equal(true);
                    done();
                }).catch(done);
            });
    });

    after(function (done) {
        user.destroy().then(function () {
            if (category_unique) category_unique.destroy().then(done());
        });
    });
});