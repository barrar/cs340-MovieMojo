var router = require('express').Router();
var moment = require('moment');

router.get('/movie/:id', function(req, res) {
    // These are two SQL queries with two results
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
    GROUP BY actors.actorID;
    SELECT
        users.name AS name,
        usersMovies.rating AS rating
    FROM usersMovies
    INNER JOIN users
        ON usersMovies.userID = users.userID
    WHERE usersMovies.movieID = :movieID
    AND usersMovies.rating IS NOT NULL`, {
        // These variables are available to both queries
        movieID: req.params.id,
        userID: req.session.userID ? req.session.userID : -1
    }, function(err, [movieRows, ratingRows], fields) {
        // The results are stored in [movieRows, ratingRows] respectively
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            // If no actors are linked, there are zero results
            if (movieRows.length > 0) {
                let actorsList = [];
                for (let i = 0; i < movieRows.length; i++) {
                    var actor = {
                        name: movieRows[i].actorName,
                        actorID: movieRows[i].actorID
                    };
                    actorsList.push(actor);
                }
                let movie = {
                        'movieID': movieRows[0].movieID,
                        'name': movieRows[0].movieName,
                        'releaseDate': moment(movieRows[0].releaseDate).format('MMM Do, YYYY'),
                        'actors': actorsList
                    }
                    // If the currently logged in user left a rating, get it
                if (req.session.userID && movieRows[0].rating) {
                    movie.userRating = movieRows[0].rating;
                }
                // Get all ratings from all users
                movie.ratings = ratingRows;
                // Get the average
                let sum = 0;
                for (let i = 0; i < ratingRows.length; i++) {
                    sum += ratingRows[i].rating;
                }
                movie.averageRating = (sum / ratingRows.length).toFixed(1);;

                res.render('movie', { "movie": movie });
            } else {
                res.render('error', { "errorMessage": "This movie is not linked to an actor" });
            }
        }
    });
});

module.exports = router;