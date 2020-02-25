var express = require('express');
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/actor/:id', function(req, res) {
    var connection = mysqlConnection();
    connection.query(`
    SELECT
        movies.name AS movieName,
        movies.movieID,
        movies.releaseDate,
        actors.name AS actorName,
        actors.birthday AS birthday,
        actors.actorID
    FROM actors
    INNER JOIN actorsMovies
        ON actorsMovies.actorID = actors.actorID
    INNER JOIN movies
        ON movies.movieID = actorsMovies.movieID
    WHERE actors.actorID = ` + req.params.id, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            var movieList = [];
            for (var i = 0; i < rows.length; i++) {
                var movie = {
                    name: rows[i].movieName,
                    releaseDate: moment(rows[i].releaseDate).format('MMM Do, YYYY'),
                    movieID: rows[i].movieID
                };
                movieList.push(movie);
            }
            var actor = {
                'name': rows[0].actorName,
                'birthday': moment(rows[0].birthday).format('MMM Do, YYYY'),
                'movies': movieList
            }
            res.render('actor', { "actor": actor });
        }
    });
    connection.end();
});

module.exports = router;