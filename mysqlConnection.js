var mysql = require('mysql');
module.exports = function() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'moviemojo',
        password: 'beta12',
        database: 'moviemojo'
    });
}