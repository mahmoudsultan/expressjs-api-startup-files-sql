const express = require('express'),
    router = express.Router(),
    sponsorsController = require('./../controllers/sponsors'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// GET /sponsors
router.get('/', sponsorsController.index);

// GET /sponsors/:id
router.get('/:id', sponsorsController.show);

// POST /sponsors
router.post('/', passport.authenticate('bearer', {
    session: false
}), sponsorsController.create);

// PUT /sponsors/:id
router.put('/:id', passport.authenticate('bearer', {
    session: false
}), sponsorsController.update);

// DELETE /sponsors/:id
router.delete('/:id', passport.authenticate('bearer', {
    session: false
}), sponsorsController.destroy);

module.exports = router;