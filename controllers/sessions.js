var Session = require('../models/main')('Session');
var Category = require('../model/main')('Category');


// GET /sessions
var index = function (req, res) {
    Session.findAll({
        include: [{
            model: Category, as: 'categories'
        }]
    }).then(function (sessions) {
        res.status(200).send(sessions).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// GET /sessions/:id
var show = function (req, res) {
    var id = req.params.id;

    Session.findById(id).then(function (session) {
        if (!session) {
            res.status(404).send({ error: "Session not found" }).end();
        } else {
            res.send(session).end();
        }
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// POST /sessions
var create = function (req, res) {
    Session.create({
        name: req.body.name
    }).then(function (session) {
        res.status(201).send(session).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// PUT /sessions/:id
var update = function (req, res) {
    Session.update(req.body, {
        where: {
            id: req.params.id
        },
        fields: ['name']
    }).then(function (session) {
        if (!session) res.status(404).end();

        res.status(200).send(session).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// DELETE /sessions/:id
var destroy = function (req, res) {
    Session.destroy({
        where: {
            id: req.params.id
        }
    }).then(function () {
        res.status(200).end();
    }).catch(function (err) {
        res.status(500).send({ error: err }).end();
    });
};

module.exports = {
    index: index,
    show: show,
    create: create,
    update: update,
    destroy: destroy
}