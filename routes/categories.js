const express = require('express'),
    router = express.Router(),
    categoriesController = require('./../controllers/categories'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// GET /categories
router.get('/', categoriesController.index);

// GET /categories/:id
router.get('/:id', categoriesController.show);

// POST /categories
router.post('/', passport.authenticate('bearer', {
    session: false
}), categoriesController.create);

// PUT /categories/:id
router.put('/:id', passport.authenticate('bearer', {
    session: false
}), categoriesController.update);

// DELETE /categories/:id
router.delete('/:id', passport.authenticate('bearer', {
    session: false
}), categoriesController.destroy);

module.exports = router;