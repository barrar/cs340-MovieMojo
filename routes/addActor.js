var express  = require('express');
var moment = require('moment');
var mysqlConnection  = require('../mysqlConnection');
var router   = express.Router();

router.get('/addActor', function(req, res) {

    var connection = mysqlConnection();
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected!');
      });


    res.render('addActor');

    connection.end();

});

module.exports = router;