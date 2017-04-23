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


module.exports = router;