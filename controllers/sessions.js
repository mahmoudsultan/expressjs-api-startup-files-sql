var Session = require('../models/main')('session');
var Category = require('../models/main')('category');
var Speaker = require('../models/main')('speaker');

// GET /sessions
var index = function (req, res) {
    Session.findAll({
        include: [{
            model: Category, as: 'categories'
        },
        {
            model: Speaker, as: "speakers"
        }]
    }).then(function (sessions) {
        res.status(200).send(sessions).end();
    }).catch(function (err) {
        res.status(400).send({ error: err }).end();
    });
};

// GET /sessions/:id
var show = function (req, res) {
    Session.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: Category, as: 'categories'
        },
        {
            model: Speaker, as: "speakers"
        }]
    }).then(function (session) {
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
    // type: "lecture", "workshop"
    // if lecture then available by default
    Session.create({
        name: req.body.name,
        start: req.body.start,
        end: req.body.end,
        day: req.body.day,
        type: req.body.type,
        available: req.body.type == "lecture" ? true : req.body.available,
        report_link: req.body.req_link ? req.body.req_link : ''
    }).then(function (session) {
        console.log("\n\n\n" + JSON.stringify(session) + "\n\n\n");
        // insert categories
        var categories = req.body.categories;

        categories.forEach((category_id, index) => {
            Category.findById(category_id).then(function (category) {
                session.addCategory(category.id).then(function (addedCategory) {
                    console.log("\n\n\n" + JSON.stringify(addedCategory, null, 2) + "\n\n\n");
                }).catch(function (err) {
                    console.log("\n\n\n" + JSON.stringify(err, null, 2) + "\n\n\n");
                    res.status(400).send({ error: err }).end();
                });
            }).catch(function (err) {
                res.status(400).send({ error: err }).end();
            });
        });

        // session.setCategories([categories]);
        res.status(201).send(session).end();
    }).catch(function (err) {
        console.log("\n\n\n\n" + err + "\n\n\n\n");
        res.status(400).send({ error: err }).end();
    });
};

// PUT /sessions/:id
var update = function (req, res) {
    Session.update(req.body, {
        where: {
            id: req.params.id
        },
        fields: ['name', 'start', 'end', 'day', 'type',
            'available', 'report_link', 'categories']
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