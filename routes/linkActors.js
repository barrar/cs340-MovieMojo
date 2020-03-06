var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();
var recaptcha = require('../recaptcha');

router.get('/linkActors', recaptcha.middleware.render, function(req, res) {
    res.render('linkActors', { "recaptcha": res.recaptcha });
});

router.post('/linkActors', recaptcha.middleware.render, recaptcha.middleware.verify, function(req, res) {
    if (req.recaptcha.error) {
        res.render('linkActors', { "recaptcha": res.recaptcha, "status": 0 });
    } else {
        var connection = mysqlConnection();

        connection.query(`INSERT INTO actorsMovies (actorID, movieID) VALUES (:actorID, :movieID)`,
            req.body,
            function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.render('linkActors', { "recaptcha": res.recaptcha, "status": 0 });
                }
                res.render('linkActors', { "recaptcha": res.recaptcha, "status": 1 });
            });
        connection.end();
    }
});

module.exports = router;