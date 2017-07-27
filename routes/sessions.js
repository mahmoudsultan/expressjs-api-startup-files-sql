const express = require('express'),
    router = express.Router(),
    sessionsController = require('./../controllers/sessions'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

router.get('/', sessionsController.index);

router.get('/:id', sessionsController.show);

router.post('/', sessionsController.create);

// router.post('/', passport.authenticate('bearer', {
    // session: false
// }), sessionsController.create);

router.put('/:id', passport.authenticate('bearer', {
    session: false
}), sessionsController.update);

router.delete('/:id', passport.authenticate('bearer', {
    session: false
}), sessionsController.destroy);

module.exports = router;