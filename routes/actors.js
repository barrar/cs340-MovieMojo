var router = require('express').Router();

router.get('/actors', function(req, res) {
    res.render('actors');
});

module.exports = router;