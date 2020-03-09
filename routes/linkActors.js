var express = require('express');
var router = express.Router();
var recaptcha = require('../recaptcha');

router.get('/linkActors', recaptcha.middleware.render, function(req, res) {
    res.render('linkActors', { "recaptcha": res.recaptcha });
});

router.post('/linkActors', recaptcha.middleware.render, recaptcha.middleware.verify, function(req, res) {
    if (req.recaptcha.error) {
        res.render('linkActors', { "recaptcha": res.recaptcha, "status": 0 });
    } else {
        mysqlPool.query(`INSERT INTO actorsMovies (actorID, movieID) VALUES (:actorID, :movieID)`,
            req.body,
            function(err, rows, fields) {
                if (err && err.code === 'ER_DUP_ENTRY') {
                    res.render('linkActors', { "recaptcha": res.recaptcha, "status": 'The actor you selected is already assigned to the movie' });
                }
                if (err) {
                    console.log(err);
                    res.render('linkActors', { "recaptcha": res.recaptcha, "status": 0 });
                }
                res.render('linkActors', { "recaptcha": res.recaptcha, "status": 1 });
            });

    }
});

module.exports = router;