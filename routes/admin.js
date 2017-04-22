const express = require('express'),
    router = express.Router(),
    adminController = require('../controllers/admin');


router.use('/create/user', adminController.createUser);

module.exports = router;