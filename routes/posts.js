const express = require('express'),
    router = express.Router(),
    postsController = require('./../controllers/posts');



router.use(function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// GET /movies/
router.get('/', postsController.index);

// GET /movies/:id
router.get('/:id', postsController.show);


router.post('/new', postsController.post);

module.exports = router;
