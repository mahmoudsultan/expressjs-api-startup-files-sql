const express = require('express'),
    router = express.Router(),
    adminController = require('../controllers/admin');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

router.post('/create/user', adminController.createUser);
router.post('/update/key', adminController.updateKey);
router.post('/delete/user', adminController.deleteUser);
router.post('/push', adminController.pushNotification)

module.exports = router;