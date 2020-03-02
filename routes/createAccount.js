var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/createAccount', function(req, res) {
    res.render('createAccount');
});

router.post('/createAccount', function(req, res) {
    var connection = mysqlConnection();
    connection.query(
        `INSERT INTO users (name, email, password) VALUES (:name, :email, :password)`,
        req.body,
        function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.render('createAccount', { "status": 0 });
            }
            res.render('createAccount', { "status": 1 });
        });

    connection.end();
});

module.exports = router;