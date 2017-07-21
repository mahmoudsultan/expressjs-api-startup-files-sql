const express = require('express'),
    router = express.Router(),
    categoriesController = require('./../controllers/categories'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

router.get('/', categoriesController.index);

router.get('/:id', categoriesController.show);

router.post('/', passport.authenticate('bearer', {
    session: false
}), categoriesController.create);

router.put('/:id', passport.authenticate('bearer', {
    session: false
}), categoriesController.update);

router.delete('/:id', passport.authenticate('bearer', {
    session: false
}), categoriesController.destroy);

module.exports = router;