var express = require('express');
var moment = require('moment');
var router = express.Router();

router.get('/searchActor', function(req, res) {
    res.render('searchActor');
});

router.post('/searchActor', function(req, res) {

    mysqlPool.query('SELECT * FROM actors WHERE actors.name LIKE :%actorName%', {
            actorName: req.body.actorName
        },
        function(err, rows, fields) {
            if (err) {
                res.render('error');
            } else {
                let actorList = [];
                for (var i = 0; i < rows.length; i++) {
                    var actor = {
                        'name': rows[i].name,
                        'birthday': moment(rows[i].birthday).format('MMM Do, YYYY'),
                        'actorID': rows[i].actorID
                    }
                    actorList.push(actor);
                }
                res.render('searchActor', { "actorList": actorList });
            }
        });


});

module.exports = router;