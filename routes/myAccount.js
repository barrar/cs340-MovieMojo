var router = require('express').Router();
var moment = require('moment');

router.get('/myAccount', function(req, res) {



    mysqlPool.query(`SELECT * FROM movies`, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            var movieList = [];
            for (var i = 0; i < rows.length; i++) {

                var movie = {
                    'name': rows[i].name,
                    'releaseDate': moment(rows[i].releaseDate).format('MMM Do, YYYY'),
                    'movieID': rows[i].movieID
                }
                movieList.push(movie);
            }


            res.render('myAccount', { "movieList": movieList });
        }
    });


});

module.exports = router;