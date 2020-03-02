var router = require('express').Router();
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var recaptcha = require('../recaptcha');

router.get('/addMovie', recaptcha.middleware.render, function(req, res) {
    res.render('addMovie', { "recaptcha": res.recaptcha });
});

router.post('/addMovie', recaptcha.middleware.render, recaptcha.middleware.verify, function(req, res) {
    if (req.recaptcha.error) {
        res.render('addMovie', { "recaptcha": res.recaptcha, "status": 0 });
    } else {
        var connection = mysqlConnection();
        req.body.releaseDate = moment(req.body.releaseDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
        connection.query(`INSERT INTO movies (name, releaseDate) VALUES (:name, :releaseDate)`,
            req.body,
            function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.render('addMovie', { "recaptcha": res.recaptcha, "status": 0 });
                }
                res.render('addMovie', { "recaptcha": res.recaptcha, "status": 1 });
            });

        connection.end();
    }
});

module.exports = router;