var router = require('express').Router();
var moment = require('moment');

router.get('/searchMovie', function(req, res) {
    res.render('searchMovie');
});

router.post('/searchMovie', function(req, res) {
    mysqlPool.query('SELECT * FROM movies WHERE movies.name LIKE :%movieName%', {
            movieName: req.body.movieName
        },
        function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                let movieList = [];
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
});

module.exports = router;