var Category = require('../models/main')('category');


// GET /categories
var index = function (req, res) {
    Category.findAll().then(function (categories) {
        res.status(200).send(categories).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// GET /categories/:id
var show = function (req, res) {
    var id = req.params.id;

    Category.findById(id).then(function (category) {
        if (!category) {
            res.status(404).send({ error: "Category not found" }).end();
        } else {
            res.send(category).end();
        }
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// POST /categories
var create = function (req, res) {
    Category.create({
        name: req.body.name
    }).then(function (category) {
        res.status(201).send(category).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// PUT /categories/:id
var update = function (req, res) {
    Category.update(req.body, {
        where: {
            id: req.params.id
        },
        fields: ['name']
    }).then(function (category) {
        if (!category) res.status(404).end();

        res.status(200).send(category).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// DELETE /categories/:id
var destroy = function (req, res) {
    Category.destroy({
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