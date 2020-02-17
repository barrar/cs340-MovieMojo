var express = require('express');
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/createAccount', function(req, res) {

    var connection = mysqlConnection();
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected!');
    });

    res.render('createAccount');

    connection.end();
});

module.exports = router;