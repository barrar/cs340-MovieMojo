var express = require('express');
var moment = require('moment');
var router = express.Router();

router.get('/movie/:id', function(req, res) {

    mysqlPool.query(`
    SELECT
        movies.movieID AS movieID,
        movies.name AS movieName,
        movies.releaseDate,
        actors.name AS actorName,
        actors.actorID
    FROM movies
    INNER JOIN actorsMovies
        ON movies.movieID = actorsMovies.movieID
    INNER JOIN actors
        ON actorsMovies.actorID = actors.actorID
    WHERE movies.movieID = ` + req.params.id, function(err, rows, fields) {
        var movie;

        if (err) {
            console.log(err);
            res.render('error');
        } else {
            if (rows.length > 0) {

                var actorsList = [];
                for (var i = 0; i < rows.length; i++) {
                    var actor = {
                        name: rows[i].actorName,
                        actorID: rows[i].actorID
                    };
                    actorsList.push(actor);
                }
                var movie = {
                    'movieID': rows[0].movieID,
                    'name': rows[0].movieName,
                    'releaseDate': moment(rows[0].releaseDate).format('MMM Do, YYYY'),
                    'actors': actorsList
                }
                res.render('movie', { "movie": movie });
            } else {
                res.render('error', { "errorMessage": "This movie is not linked to an actor" });
            }
        }
    });

});

module.exports = router;