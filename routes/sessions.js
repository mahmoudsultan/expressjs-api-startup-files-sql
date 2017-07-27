const express = require('express'),
    router = express.Router(),
    sessionsController = require('./../controllers/sessions'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// GET /sessions
router.get('/', sessionsController.index);

// GET /sessions/:id
router.get('/:id', sessionsController.show);

// POST /sessions
router.post('/', passport.authenticate('bearer', {
    session: false
}), sessionsController.create);

// PUT /sessions/:id
router.put('/:id', passport.authenticate('bearer', {
    session: false
}), sessionsController.update);

// DELETE /sessions/:id
router.delete('/:id', passport.authenticate('bearer', {
    session: false
}), sessionsController.destroy);

module.exports = router;