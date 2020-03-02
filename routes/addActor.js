var router = require('express').Router();
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var recaptcha = require('../recaptcha');

router.get('/addActor', recaptcha.middleware.render, function(req, res) {
    res.render('addActor', { "recaptcha": res.recaptcha });
});

router.post('/addActor', recaptcha.middleware.render, recaptcha.middleware.verify, function(req, res) {
    if (req.recaptcha.error) {
        res.render('addActor', { "recaptcha": res.recaptcha, "status": 0 });
    } else {
        var connection = mysqlConnection();
        req.body.birthday = moment(req.body.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD');
        connection.query(`INSERT INTO actors (name, birthday) VALUES (:name, :birthday)`,
            req.body,
            function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.render('addActor', { "recaptcha": res.recaptcha, "status": 0 });
                }
                res.render('addActor', { "recaptcha": res.recaptcha, "status": 1 });
            });
        connection.end();
    }
});

module.exports = router;