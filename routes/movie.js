var express = require('express');
var moment = require('moment');
var mysqlConnection = require('../mysqlConnection');
var router = express.Router();

router.get('/movie/:id', function (req, res) {
    var connection = mysqlConnection();
    connection.connect();

    connection.query(`
    SELECT
        movies.name AS movieName,
        movies.releaseDate,
        actors.name AS actorName,
        actors.actorID
    FROM movies
    INNER JOIN actorsMovies
        ON movies.movieID = actorsMovies.movieID
    INNER JOIN actors
        ON actorsMovies.actorID = actors.actorID
    WHERE movies.movieID = ` + req.params.id, function (err, rows, fields) {
        var movie;

        if (err) {
            console.log(err);
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {

            var actorsList = [];
            for (var i = 0; i < rows.length; i++) {
                var actor = {
                    name: rows[i].actorName,
                    actorID: rows[i].actorID
                };
                actorsList.push(actor);
            }
            console.log(actorsList);
            var movie = {
                'name': rows[0].movieName,
                'releaseDate': moment(rows[0].releaseDate).format('MMM Do, YYYY'),
                'actors': actorsList
            }
            console.log(movie);

            res.render('movie', { "movie": movie });

        }
    });

    connection.end();
});

module.exports = router;