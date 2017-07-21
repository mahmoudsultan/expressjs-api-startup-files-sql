const express = require('express'),
    router = express.Router(),
    sponsorsController = require('./../controllers/sponsors'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

router.get('/', sponsorsController.index);

router.get('/:id', sponsorsController.show);

router.post('/', passport.authenticate('bearer', {
    session: false
}), sponsorsController.create);

router.put('/:id', passport.authenticate('bearer', {
    session: false
}), sponsorsController.update);

router.delete('/:id', passport.authenticate('bearer', {
    session: false
}), sponsorsController.destroy);

module.exports = router;