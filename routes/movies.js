var router = require('express').Router();

router.get('/movies', function(req, res) {
    res.render('movies');
});

module.exports = router;