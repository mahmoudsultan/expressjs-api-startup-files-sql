var Speaker = require('../models/main')('speaker');
var Session = require('../models/main')('session');
var parallel = require('async/parallel');

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
    Speaker.findOne({
        where: { id: req.params.id },
        include: [{
            model: Session, as: "sessions",
            attributes: ["id", "name", "type"]
        }]
    }).then(function (speaker) {
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


// POST /speaker/:id/add/session/:sid
var addSession = function (req, res) {
    parallel([(callback) => {
        Speaker.findById(req.params.id).then((speaker) => {
            if (!speaker) {
                callback("Speaker not found", null);
                res.status(404);
            }
            callback(null, speaker);
        }).catch((err) => callback(err, null));
    }, (callback) => {
        Session.findById(req.params.sid).then((session) => {
            if (!session) {
                res.status(404);
                callback("Session not found", null);
            }
            callback(null, session);
        }).catch((err) => callback(err, null));
    }], function (err, results) {
        if (err) res.send({ error: err }).end();
        var speaker = results[0];
        var session = results[1];
        speaker.addSession(session).then(() => {
            res.status(200).end();
        }).catch((err) => {
            res.status(500).send({ error: err }).end();
        });
    })
};


// POST /speaker/:id/remove/session/:sid
var removeSession = function (req, res) {
    parallel([(callback) => {
        Speaker.findById(req.params.id).then((speaker) => {
            if (!speaker) {
                callback("Speaker not found", null);
                res.status(404);
            }
            callback(null, speaker);
        }).catch((err) => callback(err, null));
    }, (callback) => {
        Session.findById(req.params.sid).then((session) => {
            if (!session) {
                res.status(404);
                callback("Session not found", null);
            }
            callback(null, session);
        }).catch((err) => callback(err, null));
    }], function (err, results) {
        if (err) res.send({ error: err }).end();
        var speaker = results[0];
        var session = results[1];
        speaker.removeSession(session).then(() => {
            res.status(200).end();
        }).catch((err) => {
            res.status(500).send({ error: err }).end();
        });
    })
};


module.exports = {
    index: index,
    show: show,
    create: create,
    update: update,
    destroy: destroy,
    addSession: addSession,
    removeSession: removeSession
}