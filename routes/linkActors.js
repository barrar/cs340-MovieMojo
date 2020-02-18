var express = require('express');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/linkActors', function(req, res) {

    var connection = mysqlConnection();
    connection.connect((err) => {
        if (err) throw err;
    });


    res.render('linkActors');

    connection.end();

});

module.exports = router;