var User = require('../models/main')('users');
var tokenGenerator = require('../helpers/auth_token');
const bcrypt = require('bcrypt-nodejs');

// for debuging remove when production
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


// PUT /users/:alias
function update(req, res) {
    User.update(req.body, {
        where: {
            alias: req.params.alias
        },
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
                }).catch(err => {
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

module.exports = {
    login: login,
    logout: logout,
    index: index,
    show: show,
    update: update
};