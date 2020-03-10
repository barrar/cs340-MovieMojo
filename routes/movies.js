var router = require('express').Router();
var moment = require('moment');

router.get('/movies', function(req, res) {
    mysqlPool.query(`SELECT * FROM movies`, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            let movieList = [];
            for (var i = 0; i < rows.length; i++) {
                var movie = {
                    'text': rows[i].name + " - released " + moment(rows[i].releaseDate).format('MMM Do, YYYY'),
                    'movieID': rows[i].movieID
                }
                movieList.push(movie);
            }
            res.render('movies', { "movieList": movieList });
        }
    });
});


module.exports = router;