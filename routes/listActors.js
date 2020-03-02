var express = require('express');
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/listActors', function(req, res) {
    var connection = mysqlConnection();
    connection.query(`SELECT * FROM actors`, function(err, rows, fields) {
        if (err) {
            res.render('error');
        } else {
            for (var i = 0; i < rows.length; i++) {
                rows[i].birthday = moment(rows[i].birthday).format('MMM Do, YYYY');
            }
            res.render('listActors', { "actorList": rows });
        }
    });
    connection.end();
});

module.exports = router;