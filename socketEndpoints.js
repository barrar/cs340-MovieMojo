var moment = require('moment');

module.exports = function(io) {
    io.on('connection', function(socket) {
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
        socket.on('setRating', function(data, fn) {
            console.log(data);
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