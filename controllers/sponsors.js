var Sponsors = require('../models/main')('sponsors');


// GET /sponsors
var index = function (req, res) {
    Sponsors.findAll().then(function (sponsors) {
        res.status(200).send(sponsors).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// GET /sponsors/:id
var show = function (req, res) {
    var id = req.params.id;

    Sponsors.findById(id).then(function (sponsor) {
        if (!sponsor) {
            res.status(404).send({ error: "Sponsor not found" }).end();
        } else {
            res.send(sponsor).end();
        }
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// POST /sponsors
var create = function (req, res) {
    Sponsors.create({
        name: req.body.name,
        link: req.body.link,
        type: req.body.type
    }).then(function (sponsor) {
        res.status(201).send(sponsor).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// PUT /sponsors/:id
var update = function (req, res) {
    Sponsors.update(req.body, {
        where: {
            id: req.params.id
        },
        fields: ['name', 'link', 'type']
    }).then(function (sponsor) {
        if (!sponsor) res.status(404).end();

        res.status(200).send(sponsor).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// DELETE /sponsors/:id
var destroy = function (req, res) {
    Sponsors.destroy({
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