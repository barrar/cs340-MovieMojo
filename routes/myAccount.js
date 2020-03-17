var router = require('express').Router();
var moment = require('moment');

router.get('/myAccount', function(req, res) {
    mysqlPool.query(`
        SELECT 
            movies.movieID,
            name,
            releaseDate,
            watched,
            rating
        FROM movies
        INNER JOIN usersMovies
            ON movies.movieID = usersMovies.movieID
        WHERE userID = :userID;
        SELECT
            actors.name,
            actors.actorID
        FROM users
        INNER JOIN actors
            ON users.actorID = actors.actorID
        WHERE users.userID = :userID 
            `, {
            userID: req.session.userID ? req.session.userID : -1
        },
        function(err, [movieRows, favoriteActor], fields) {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                let watchedList = [];
                let watchLaterList = [];
                let ratingsList = [];
                for (var i = 0; i < movieRows.length; i++) {
                    var movie = {
                        'name': movieRows[i].name,
                        'releaseDate': moment(movieRows[i].releaseDate).format('MMM Do, YYYY'),
                        'movieID': movieRows[i].movieID,
                        'rating': movieRows[i].rating
                    }
                    if (movieRows[i].watched == 1) {
                        watchedList.push(movie);
                    } else {
                        watchLaterList.push(movie);
                    }
                    if (movieRows[i].rating) {
                        ratingsList.push(movie);
                    }

                }

                res.render('myAccount', {
                    "watchedList": watchedList,
                    "watchLaterList": watchLaterList,
                    "ratingsList": ratingsList,
                    "favoriteActor": favoriteActor
                });
            }
        });
});
module.exports = router;