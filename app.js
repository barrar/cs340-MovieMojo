var express = require('express');
var requireDir = require('require-dir');

// Express is the foundation of the app
// app.use can set up routes
var app = express();

// pug can use this to find files on the filesystem
app.locals.basedir = '/var/www/moviemojo';

// Static assests are served directly using express.static()
// These can be served faster with nginx directly
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/media', express.static('media'));

// This will auto reload the browser when code changes
// All relevant files are watched for changes
// Pages load much faster when this is turned off
// Use this for dev only
var browserSync = require('browser-sync');
var bs = browserSync.create();
bs.init({
    watch: true,
    // Only watch relevant file types
    files: ['**/*.js', '**/*.css', '**/*.pug'],
    watchOptions: {
        ignoreInitial: true,
        ignored: ["node_modules", "logs", ".git"],
    },
    reloadDelay: 300,
    logSnippet: false
})
app.use(require('connect-browser-sync')(bs, { injectHead: true }));

// The pug template engine is used for rendering
app.set('view engine', 'pug');

// All the files in the /routes folder are required
// These files contain routes such as /actor/:id
// when /actor/1 is loaded that page is rendered using /routes/actor.js
// This is defined by router.get('/actor/:id', function (req, res) {
// note that /views/actor.pug is used to render the page from from actor.js
var routes = requireDir('./routes');
for (var i in routes) app.use('/', routes[i]);

// Listen on port 80, this requires root
// A better setup would be some other port like port 3050
// and then use nginx to proxy requests with https and http2
app.listen(80, function() {});