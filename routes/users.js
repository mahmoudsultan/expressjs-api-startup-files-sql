const express = require('express'),
    router = express.Router(),
    usersController = require('./../controllers/users');

router.use('/login', usersController.login);

module.exports = router;