var moment = require('moment');
var mysqlConnection = require('./mysqlConnection');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('movie', function(searchTerm, fn) {
            var connection = mysqlConnection();
            q = connection.query('SELECT * FROM movies WHERE movies.name LIKE :%movieName%', {
                    movieName: searchTerm
                },
                function(err, rows, fields) {
                    movieList = [];
                    if (!err) {
                        for (var i = 0; i < rows.length && i < 4; i++) {
                            var movie = {
                                'movieID': rows[i].movieID,
                                'text': rows[i].name + " - released " + moment(rows[i].releaseDate).format('MMM Do, YYYY')
                            }
                            movieList.push(movie);
                        }
                    }
                    fn(movieList);
                });
            connection.end();
        });
        socket.on('actor', function(searchTerm, fn) {
            var connection = mysqlConnection();
            q = connection.query('SELECT * FROM actors WHERE actors.name LIKE :%actorName%', {
                    actorName: searchTerm
                },
                function(err, rows, fields) {
                    actorList = [];
                    if (!err) {
                        for (var i = 0; i < rows.length && i < 4; i++) {
                            var actor = {
                                'actorID': rows[i].actorID,
                                'text': rows[i].name + " - born " + moment(rows[i].birthday).format('MMM Do, YYYY')
                            }
                            actorList.push(actor);
                        }
                    }
                    fn(actorList);
                });
            connection.end();
        });
    });
}