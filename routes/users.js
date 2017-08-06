const express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/users'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

router.post('/login', usersController.login);
router.post('/logout', usersController.logout);
router.get('/:alias', usersController.show);
router.get('/', usersController.index);
router.post('/:id/add/session/:sid',usersController.addSession);
router.post('/:id/remove/session/:sid',usersController.removeSession);

// updating the user must be authorized 
router.put('/:alias', passport.authenticate('bearer', {
    session: false
}), usersController.update);

// verify the user
router.post('/verify', passport.authenticate('bearer', {
    session: false
}), usersController.verify);

router.get('/showuser', passport.authenticate('bearer', {
    session: false
}), usersController.showUser);

module.exports = router;