var Speaker = require('../models/main')('speaker');


// GET /speakers
var index = function (req, res) {
    
    var page = req.params.page || 0;
    var limit = req.params.limit || 10;
    var offset = page * limit;    

    Speaker.findAll({
        offset: offset,
        limit: limit
    }).then(function (speaker) {
        res.status(200).send(speaker).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// GET /speakers/:id
var show = function (req, res) {
 
    var id = req.params.id;

    Speaker.findById(id).then(function (speaker) {
        if (!speaker) {
            res.status(404).send({ error: "Speaker not found" }).end();
        } else {
            res.send(speaker).end();
        }
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// POST /speakers
var create = function (req, res) {
    Speaker.create(req.body, {
        fields: ['name', 'email', 'phone', 'linkedin']
    }).then(function (speaker) {
        res.status(201).send(speaker).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// PUT /speaker/:id
var update = function (req, res) {
    Speaker.update(req.body, {
        where: {
            id: req.params.id
        },
        fields: ['name', 'email', 'phone', 'linkedin']
    }).then(function (speaker) {
        if (!speaker) res.status(404).end();

        res.status(200).send(speaker).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// DELETE /speaker/:id
var destroy = function (req, res) {
    Speaker.destroy({
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