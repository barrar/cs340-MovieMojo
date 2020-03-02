var router = require('express').Router();
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');

router.get('/searchMovie', function(req, res) {
    res.render('searchMovie');
});

router.post('/searchMovie', function(req, res) {
    var connection = mysqlConnection();
    connection.query('SELECT * FROM movies WHERE movies.name LIKE :%movieName%', {
            movieName: req.body.movieName
        },
        function(err, rows, fields) {
            if (err) {
                res.render('error');
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
                res.render('searchMovie', { "movieList": movieList });
            }
        });

    connection.end();
});

module.exports = router;