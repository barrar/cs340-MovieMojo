var mysql = require('mysql');
module.exports = function() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'moviemojo',
        password: 'beta12',
        database: 'moviemojo'
    });

    connection.connect();

    connection.config.queryFormat = function(query, values) {
        if (!values) return query;
        return query.replace(/\:(%|_+)?(\w+)(%|_+)?/g, function(txt, prefix = '', key, suffix = '') {
            if (values.hasOwnProperty(key)) {
                return this.escape(prefix + values[key] + suffix);
            }
            return txt;
        }.bind(this));
    };

    return connection;
}