var express = require('express');
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/signIn', function(req, res) {
    var connection = mysqlConnection();
    res.render('signIn');
    connection.end();
});

router.post('/signIn', function(req, res) {
    var connection = mysqlConnection();
    connection.query(
        `SELECT * FROM moviemojo.users
        WHERE email=:email and password=:password;`,
        req.body,
        function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.render('signIn', { "status": 0 });
            }
            if (rows.length > 0) {
                req.session.userID = rows[0].userID;
                req.session.name = rows[0].name;
                req.session.email = rows[0].email;
                req.session.password = rows[0].password;
                res.redirect('/');
            } else {
                res.render('signIn', { "status": 0 });
            }
        });
    connection.end();
});

router.get('/signIn/signOut', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;