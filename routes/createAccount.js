var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();
var recaptcha = require('../recaptcha');

router.get('/createAccount', recaptcha.middleware.render, function(req, res) {
    res.render('createAccount', { "recaptcha": res.recaptcha });
});

router.post('/createAccount', recaptcha.middleware.render, recaptcha.middleware.verify, function(req, res) {
    if (req.recaptcha.error) {
        res.render('createAccount', { "recaptcha": res.recaptcha, "status": 0 });

    } else {
        var connection = mysqlConnection();
        connection.query(
            `INSERT INTO users (name, email, password) VALUES (:name, :email, :password)`,
            req.body,
            function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.render('createAccount', { "recaptcha": res.recaptcha, "status": 0 });
                }
                res.redirect('/signIn');
            });

        connection.end();
    }
});

module.exports = router;