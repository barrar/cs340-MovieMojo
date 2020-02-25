var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/linkActors', function(req, res) {
    res.render('linkActors');
});

module.exports = router;