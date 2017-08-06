var User = require('../models/main')('user');
var Pusher = require('pusher'),
    config = require('../config');

const pusher = new Pusher({
    appId: config.pusher.appId,
    key: config.pusher.key,
    secret: config.pusher.secret,
    cluster: config.pusher.cluster,
    encrypted: true
});

function createUser(req, res) {
    /*  
        create a new user with the information given in the body of 
        the request:
        {
            alias: user alias
            name: user full name
            password: password unencreapted
            email: da
            collage: optional
            department: optional
        }
    */
    User.create(req.body, {
        // fields is like permit in rails; will include only permitted field in 
        // the create query
        fields: ['alias', 'name', 'password', 'email', 'collage', 'department']
    }).then(function (createUser) {
        if (!createUser) {
            res.status(500).end();
        } else {
            res.status(201).send({
                id: createUser.id,
                alias: createUser.alias
            }).location('/users/' + createUser.alias).end();
        }
    }).catch(function (err) {
        res.status(500).send({
            error: err
        }).end();
    });
}

function updateKey(req, res) {
    /*
        This updateKey function is to update the key of the user's ticket
        req.body = {
            id: user's id
            key: the new key
        }
    */

    if (!req.body.id || !req.body.key) {
        res.status(400).end();
    } else {

        // console.log("Key", req.body.key);

        User.update({
            key: req.body.key
        }, {
                where: {
                    id: req.body.id
                }
            }).then(function (updatedUser) {
                if (!updatedUser) res.send(404).end();

                res.status(200).end();

            }).catch(function (err) {
                res.status(500).send({
                    error: err
                });
            });
    }
}

function deleteUser(req, res) {
    /*
    delete the user provided by it's id
    req.body= {
        id: user's - that's to be deleted -  id 
    }
    */

    if (!req.body.id)
        res.status(400).end();

    User.destroy({
        where: {
            id: req.body.id
        }
    }).then(function () {
        res.status(200).end();
    }).catch(function (err) {
        res.status(500).send({ error: err }).end();
    });
}

/*
    Push notification to a certin channel and event
    POST /admin/push
    req.body = {
        channel: notification channel(optional)
        event: (optional)
        mssg: notification message
    }
*/
function pushNotification(req, res) {
    var channel = req.body.channel || config.pusher.default_channel;
    var event = req.body.event || config.pusher.default_event;
    var mssg = req.body.mssg;
    // console.log(req.body.mssg)
    if (!mssg) {
        res.status(400).send({ error: "No message provided" }).end();
    } else {
        pusher.trigger(channel, event, {
            "message": mssg
        });
        res.status(200).end();
    }
}

module.exports = {
    createUser: createUser,
    updateKey: updateKey,
    deleteUser: deleteUser,
    pushNotification: pushNotification
};