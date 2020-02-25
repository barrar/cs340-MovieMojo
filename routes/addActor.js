var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/addActor', function(req, res) {
    res.render('addActor');
});

module.exports = router;