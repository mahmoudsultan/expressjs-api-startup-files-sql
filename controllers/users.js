var User = require('../models/main')('users');
var tokenGenerator = require('../helpers/auth_token');
const bcrypt = require('bcrypt-nodejs');

function loginSetup(req, res) {
    bcrypt.hash(req.body.password, null, null, function (error, password) {
        if (error) {
            res.status(500).end();
        } else {
            req.body.password = password;
            login(req, res);
        }
    }); 
}

function login(req, res) {

    var name = req.body.name;
    var password = req.body.password;
    var token = null;
    // find the user with the name and password
    User.findOne({
        where: {
            name: name,
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
                }).catch(err => { throw err } );
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
    login: login
};