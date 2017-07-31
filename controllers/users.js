var User = require('../models/main')('user');
var tokenGenerator = require('../helpers/auth_token');
const bcrypt = require('bcrypt-nodejs');
var Session = require('../models/main')('session');
var parallel = require('async/parallel');

// TODO: remove 
// for debugging purpose only
function showUser(req, res) {
    res.send(user).end()
}


// TODO: for debuging remove when production
function index(req, res) {
    User.findAll().then(function (users) {
        res.status(200).send(users).end();
    }).catch(function (err) {
        res.status(500).end()
    })
}

// GET /show/:alias gets the information of a user
function show(req, res) {
    User.findOne({
        where: {
            alias: req.params.alias
        },
        include: [{
            model: Session, as: "sessions",
            attributes: ["id", "name", "type"]
        }],
        attributes: ['id', 'alias', 'email', 'collage', 'department']
    }).then(function (user) {
        if (!user) {
            // user not found send 404
            res.status(404).end();
        } else {
            res.status(200).send(user).end();
        }
    }).catch(function (err) {
        res.status(500).send({
            error: err
        }).end();
    })
}

/*
 This function is called from updateWrapper when the authorization
 if complete to edit the user
 */
// PUT /users/:alias
function update(req, res) {
    User.update(req.body, {
        where: {
            alias: req.params.alias
        },
        // permit only the following fields to be updated
        fields: ['alias', 'email', 'collage', 'department', 'name']
    }).then(function (user) {
        if (!user) res.status(404).end();

        res.status(200).send(user).end();
    }).catch(function (err) {
        res.status(500).send({
            error: err
        }).end();
    })
}

/*
 Checks if the user requesting edit has the authentication
 key of the user to edit
 TODO: Add admin edit
 */
// PUT /users/:alias
function updateWrapper(req, res) {
    if (!req.user || !req.params.alias || req.user.alias != req.params.alias) {
        res.status(401).end()
    } else {
        return update(req, res)
    }
}

/*
 if the key given in the body of the request is the same as the key
 in the database then the user is activated
 */
// POST /verify
function verify(req, res) {
    if (req.user.key === req.body.key) {
        req.user.update({
            activated: true
        }).then(function () {
            res.status(200).end();
        }).catch(function (err) {
            res.status(500).send({ error: err }).end();
        })
    } else {
        res.status(400).send({ error: "Invalid Key" }).end()
    }
}


// POST /logout Authorization: token logs out a user
function logout(req, res) {
    // get the auth_token form the header of the request
    var token = req.get('Authorization').slice(7);

    if (!token) {
        // if no token found send 400 and end the
        res.status(400).end();
    } else {
        // update the token to null to logout
        User.update({
            token: null
        }, {
                where: {
                    token: token
                }
            }).then(function () {
                res.status(200).end();
            }).catch(function (err) {
                // 500: internal server error
                res.status(500).send({
                    error: err
                });
            })
    }
}

// POST /login {alias: user_alias, password: user_password} logs in a user
// if information is valid
function login(req, res) {

    var alias = req.body.alias;
    var password = req.body.password;
    var token = null;
    // find the user with the alias and password
    User.findOne({
        where: {
            alias: alias,
        }
    }).then(function (user) {
        if (!user) {
            res.status(404).send({
                error: 'Username or password is not correct .. '
            }).end();
        } else if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).send({
                error: "Username or password is incorrect .. "
            }).end();
        } else {
            tokenGenerator(User, false, function (token) {
                user.update({
                    token: token
                }).then(function (user) {
                    res.setHeader('Authorization', 'Bearer ' + token);
                    res.status(200).send({
                        mssg: "User logged in successfully.. "
                    }).end();
                }).catch(function (err) {
                    throw err
                });
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(500).send({
            error: 'Internal server error.. '
        }).end();
    });
}

// POST /user/:id/add/session/:sid
var addSession = function (req, res) {
    parallel([(callback) => {
        User.findById(req.params.id).then((user) => {
            if (!user) {
                callback("User not found", null);
                res.status(404);
            }
            callback(null, user);
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
        var user = results[0];
        var session = results[1];
        if(session.number_of_seats - 1 >= 0) {
            user.addSession(session).then(() => {
                session.number_of_seats -= 1;
                session.save();
                res.status(200).end();
            }).catch((err) => {
                res.status(500).send({error: err}).end();
            });
        }
    })
};


// POST /user/:id/remove/session/:sid
var removeSession = function (req, res) {
    console.log('*******');
    console.log(req.params);
    parallel([(callback) => {
        User.findById(req.params.id).then((user) => {
            if (!user) {
                callback("User not found", null);
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
        var user = results[0];
        var session = results[1];
        user.removeSession(session).then(() => {
            session.number_of_seats += 1;
            session.save();
            res.status(200).end();
        }).catch((err) => {
            res.status(500).send({ error: err }).end();
        });
    })
};

module.exports = {
    login: login,
    logout: logout,
    index: index,
    show: show,
    update: updateWrapper,
    verify: verify,
    showUser: showUser,
    removeSession:removeSession,
    addSession:addSession
};