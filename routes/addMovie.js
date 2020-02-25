var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/addMovie', function(req, res) {
    res.render('addMovie');
});

module.exports = router;