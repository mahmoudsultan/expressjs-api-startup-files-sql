var User = require('../models/main')('users');


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

module.exports = {
    createUser: createUser
};