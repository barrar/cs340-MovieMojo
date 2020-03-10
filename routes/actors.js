var router = require('express').Router();
var moment = require('moment');

router.get('/actors', function(req, res) {
    mysqlPool.query(`SELECT * FROM actors`, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            for (var i = 0; i < rows.length; i++) {
                rows[i].birthday = moment(rows[i].birthday).format('MMM Do, YYYY');
            }
            res.render('actors', { "actorList": rows });
        }
    });
});

module.exports = router;