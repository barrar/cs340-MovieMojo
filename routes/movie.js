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
        actors.actorID,
        usersMovies.rating AS rating
    FROM movies
    INNER JOIN actorsMovies
        ON movies.movieID = actorsMovies.movieID
    INNER JOIN actors
        ON actorsMovies.actorID = actors.actorID
    LEFT JOIN usersMovies
        ON movies.movieID = usersMovies.movieID
        AND usersMovies.userID = :userID
    WHERE movies.movieID = :movieID
    GROUP BY actors.actorID`, {
        movieID: req.params.id,
        userID: req.session.userID ? req.session.userID : -1
    }, function(err, rows, fields) {
        var movie;

        if (err) {
            console.log(err);
            res.render('error');
        } else {
            if (rows.length > 0) {
                let actorsList = [];
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
                if (req.session.userID && rows[0].rating) {
                    movie.rating = rows[0].rating;
                }
                console.log(movie);
                res.render('movie', { "movie": movie });
            } else {
                res.render('error', { "errorMessage": "This movie is not linked to an actor" });
            }
        }
    });
});

module.exports = router;