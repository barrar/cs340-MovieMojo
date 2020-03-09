var router = require('express').Router();
var recaptcha = require('../recaptcha');

router.get('/signIn', recaptcha.middleware.render, function(req, res) {
    res.render('signIn', { "recaptcha": res.recaptcha });
});

router.post('/signIn', recaptcha.middleware.render, recaptcha.middleware.verify, function(req, res) {
    if (req.recaptcha.error) {
        res.render('signIn', { "recaptcha": res.recaptcha, "status": 0 });
    } else {

        mysqlPool.query(
            `SELECT * FROM moviemojo.users
        WHERE email=:email and password=:password;`,
            req.body,
            function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.render('signIn', { "recaptcha": res.recaptcha, "status": 0 });
                }
                if (rows.length > 0) {
                    req.session.userID = rows[0].userID;
                    req.session.name = rows[0].name;
                    req.session.email = rows[0].email;
                    req.session.password = rows[0].password;
                    res.redirect('/');
                } else {
                    res.render('signIn', { "recaptcha": res.recaptcha, "status": 0 });
                }
            });

    }
});

router.get('/signIn/signOut', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;