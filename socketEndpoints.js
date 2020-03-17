var moment = require('moment');
var cookie = require('cookie');


module.exports = function(io) {
    io.on('connection', function(socket) {
        // let stringSession = cookie.parse(socket.request.headers.cookie).session_mysql.split('.')[0].split(':')[1];
        // let userID = -1
        // sessionStore.get(stringSession, function(error, session) {
        //     userID = session.userID
        //     console.log(userID);

        // });
        socket.on('movie', function(searchTerm, max, fn) {
            mysqlPool.query('SELECT * FROM movies WHERE movies.name LIKE :%movieName%', {
                    movieName: searchTerm
                },
                function(err, rows, fields) {
                    movieList = [];
                    if (!err) {
                        for (var i = 0; i < rows.length && i < max; i++) {
                            var movie = {
                                'movieID': rows[i].movieID,
                                'text': rows[i].name + " - released " + moment(rows[i].releaseDate).format('MMM Do, YYYY')
                            }
                            movieList.push(movie);
                        }
                    }
                    fn(movieList);
                });
        });
        socket.on('actor', function(searchTerm, max, fn) {
            mysqlPool.query('SELECT * FROM actors WHERE actors.name LIKE :%actorName%', {
                    actorName: searchTerm
                },
                function(err, rows, fields) {
                    actorList = [];
                    if (!err) {
                        for (var i = 0; i < rows.length && i < max; i++) {
                            var actor = {
                                'actorID': rows[i].actorID,
                                'text': rows[i].name + " - born " + moment(rows[i].birthday).format('MMM Do, YYYY')
                            }
                            actorList.push(actor);
                        }
                    }
                    fn(actorList);
                });
        });
        socket.on('setList', function(data, fn) {
            console.log(data);
            mysqlPool.query(`
                INSERT INTO usersMovies VALUES (:userID, :movieID, NULL, :watched)
                ON DUPLICATE KEY UPDATE
                watched = :watched`,
                data,
                function(err, rows, fields) {
                    if (err) {
                        fn('There was a problem saving to your list. Are you logged in?');
                    } else {
                        listName = data.watched ? "watched" : "watch later"
                        fn('Saved to your ' + listName + ' list');
                    }
                });
        });
        socket.on('setRating', function(data, fn) {
            mysqlPool.query(`
                INSERT INTO usersMovies VALUES (:userID, :movieID, :rating, 1)
                ON DUPLICATE KEY UPDATE
                rating = :rating`,
                data,
                function(err, rows, fields) {
                    if (err) {
                        fn('There was a problem saving your rating. Are you logged in?');
                    } else {
                        fn('Rating Saved');
                    }
                });
        });
        socket.on('deleteMovieFromList', function(data, fn) {
            mysqlPool.query(`
                DELETE FROM usersMovies
                WHERE userID = :userID
                AND movieID = :movieID`,
                data,
                function(err, rows, fields) {
                    if (err) {
                        fn('There was a problem deleting the movie from your list');
                    } else {
                        fn('The movie was removed from your list');
                    }
                });
        });
        socket.on('changePassword', function(data, fn) {
            mysqlPool.query(`
                UPDATE users
                SET password = :password
                WHERE userID = :userID`,
                data,
                function(err, rows, fields) {
                    if (err) {
                        fn('There was a problem updating your password.');
                    } else {
                        fn('Your password was updated');
                    }
                });
        });
        socket.on('addFavoriteActor', function(data, fn) {
            mysqlPool.query(`
                UPDATE users
                SET actorID = :actorID
                WHERE userID = :userID`,
                data,
                function(err, rows, fields) {
                    if (err) {
                        fn('There was a problem saving favorite actor. Are you logged in?');
                    } else {
                        fn('Your favorite actor was saved');
                    }
                });
        });
        socket.on('deleteFavoriteActor', function(data, fn) {
            mysqlPool.query(`
                UPDATE users
                SET actorID = NULL
                WHERE userID = :userID`,
                data,
                function(err, rows, fields) {
                    if (err) {
                        fn('There was a problem removing your favorite actor');
                    } else {
                        fn('Your favorite actor was removed');
                    }
                });
        });
        // socket.on('getRating', function(data, fn) {
        //     mysqlPool.query(`
        //         SELECT rating
        //         FROM usersMovies
        //         WHERE userID = :userID AND movieID = :movieID`,
        //         data,
        //         function(err, rows, fields) {
        //             if (!err && rows.length > 0) {
        //                 fn(rows[0].rating);
        //             }
        //         });
        // });
    });
}