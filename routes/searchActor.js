var express = require('express');
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/searchActor', function(req, res) {
    res.render('searchActor');
});

module.exports = router;