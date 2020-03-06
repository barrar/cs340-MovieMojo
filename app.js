// Express is the foundation of the app
// app.use can set up routes
var express = require('express');
var app = express();
app.disable('x-powered-by');

// Set up session for log in
var session = require('express-session');
var MemoryStore = require('memorystore')(session);
app.set('trust proxy', '127.0.0.1');
app.use(session({
    cookie: { secure: true, maxAge: 864000000, sameSite: true },
    store: new MemoryStore({
        checkPeriod: 864000000 // 10 days
    }),
    secret: 'wdNKBP93kO7E8NtWKNWL',
    resave: false,
    saveUninitialized: true
}));

// Set locals for use in pug templates
app.use((req, res, next) => {
    if (req.session && req.session.userID) {
        res.locals.sessionUserID = req.session.userID;
        res.locals.sessionName = req.session.name;
        res.locals.sessionEmail = req.session.email;
    } else {
        res.locals.sessionUserID = -1;
    }
    next();
});

// Set up ability to get form post data
app.use(express.urlencoded({ extended: true }))

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

// var browserSync = require('browser-sync');
// var bs = browserSync.create();
// bs.init({
//     ui: false,
//     watch: true,
//     // Only watch relevant file types
//     files: ['**/*.js', '**/*.css', '**/*.pug'],
//     watchOptions: {
//         ignoreInitial: true,
//         ignored: ["node_modules", "logs", ".git"],
//     },
//     reloadDelay: 100,
//     injectChanges: false,
//     logSnippet: false
// })
// app.use(require('connect-browser-sync')(bs, { injectHead: true }));

// The pug template engine is used for rendering
app.set('view engine', 'pug');

// All the files in the /routes folder are required
// These files contain routes such as /actor/:id
// when /actor/1 is loaded that page is rendered using /routes/actor.js
// This is defined by router.get('/actor/:id', function (req, res) {
// note that /views/actor.pug is used to render the page from from actor.js
var routes = require('require-dir')('./routes');
for (var i in routes) app.use('/', routes[i]);

// To listen on port 80, run as root
// The live server currently uses nginx to proxy requests
var server = app.listen(8001, function() {});

// socket.io shares the http server with express
var io = require('socket.io').listen(server);
// This file handles the various socket.on('endpointName') calls
require('./socketEndpoints.js')(io);