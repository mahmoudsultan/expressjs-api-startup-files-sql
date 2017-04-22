const express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/users');

router.use('/login', usersController.login);
router.use('/logout', usersController.logout);
router.use('/:alias', usersController.show);
router.use('/', usersController.index);

module.exports = router;