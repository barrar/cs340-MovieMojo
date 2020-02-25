var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/createAccount', function(req, res) {
    res.render('createAccount');
});

module.exports = router;