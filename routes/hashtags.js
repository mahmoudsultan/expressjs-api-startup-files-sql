const express = require('express'),
    router = express.Router(),
    hashtagController = require('../controllers/hashtags'),
    passport = require('passport');

router.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    next();
});

// GET /hashtags
router.get('/', hashtagController.index);
// router.get('/:id', hashtagController.show);
// router.post('/', passport.authenticate('bearer', {
//     session: false
// }), hashtagController.create);

// GET /hashtags/:page/:limit
router.get('/:page/:limit', hashtagController.index);

// POST /hashtags
router.post('/', hashtagController.create);

// GET /hashtags/:title/post/count
router.get('/:title/posts/count', hashtagController.count);

// GET /hashtags/:title
router.get('/:title', hashtagController.show);


module.exports = router;