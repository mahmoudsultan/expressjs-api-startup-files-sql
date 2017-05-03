const router = require('express').Router(),
    notificationsController = require('../controllers/notifications');


router.post('/', notificationsController.index)

module.exports = router;