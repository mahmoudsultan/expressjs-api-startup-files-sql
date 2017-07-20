const express = require('express'),
    router = express.Router(),
    moviesController = require('./../controllers/movies');



router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// GET /movies/
router.get('/', moviesController.index);

router.get('/:id', moviesController.show);
router.post('/new', moviesController.post);

module.exports = router;