const express = require('express'),
    router = express.Router(),
    postsController = require('./../controllers/posts');
const passport = require('passport');


router.use(function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// GET /posts/
router.get('/', postsController.index);

// GET /posts/:id
router.get('/:id', postsController.show);

// POST /posts
router.post('/', passport.authenticate('bearer', {
    session: false
}),postsController.post);

// PUT /posts/:id
router.put('/:id', passport.authenticate('bearer', {
    session: false
}), postsController.update);

router.delete('/:id', passport.authenticate('bearer', {
    session: false
}), postsController.destroy);

module.exports = router;
