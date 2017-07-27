const express = require('express'),
    router = express.Router(),
    speakersController = require('./../controllers/speakers'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// TODO Lock this up

// GET /speakers/
router.get('/', speakersController.index);

// GET /speakers/:page/:limit
router.get('/:page/:limit', speakersController.index);

// GET /speakers/:id
router.get('/:id', speakersController.show);

// POST /speakers
router.post('/', speakersController.create);


// POST /speakers/:id/add/session/:sid
router.post('/:id/add/session/:sid', speakersController.addSession);

// POST /speakers/:id/remove/session/:sid
router.post('/:id/remove/session/:sid', speakersController.removeSession);


// PUT /speakers/:id
router.put('/:id', speakersController.update);

router.delete('/:id', speakersController.destroy);

module.exports = router;
