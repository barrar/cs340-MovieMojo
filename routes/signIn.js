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

});

module.exports = router;