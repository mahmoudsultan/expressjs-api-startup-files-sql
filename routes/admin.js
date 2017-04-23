const express = require('express'),
    router = express.Router(),
    adminController = require('../controllers/admin');


router.post('/create/user', adminController.createUser);
router.post('/update/key', adminController.updateKey);
router.post('/delete/user', adminController.deleteUser);

module.exports = router;