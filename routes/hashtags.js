const express = require('express'),
    router = express.Router(),
    hashtagController = require('../controllers/hashtag');
const passport = require('passport');


router.get('/', hashtagController.index);
router.get('/:id', hashtagController.show);
router.post('/', passport.authenticate('bearer', {
    session: false
}), hashtagController.create);


module.exports = router;