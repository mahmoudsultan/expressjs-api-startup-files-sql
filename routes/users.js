const express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/users');
const passport = require('passport');

router.post('/login', usersController.login);
router.post('/logout', usersController.logout);
router.get('/:alias', usersController.show);
router.get('/', usersController.index);

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