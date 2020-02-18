var express = require('express');
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/listMovies', function(req, res) {

    var connection = mysqlConnection();
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected!');
    });


    connection.query(`SELECT * FROM movies`, function(err, rows, fields) {
        if (err) {
            console.log(typeof(err));
            console.log(err);
            for (var k in err) {
                console.log(`${k}: ${err[k]}`);
            }
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            var movieList = [];
            for (var i = 0; i < rows.length; i++) {

                var movie = {
                    'name': rows[i].name,
                    'releaseDate': moment(rows[i].releaseDate).format('MMM Do, YYYY'),
                    'movieID': rows[i].movieID
                }
                movieList.push(movie);
            }


            res.render('listMovies', { "movieList": movieList });
        }
    });
    connection.end();

});

module.exports = router;