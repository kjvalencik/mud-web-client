// builtin
var http = require('http'),
	path = require('path');

// vendor
var express = require('express'),
	passport = require('passport'),
	RedisStore = require('connect-redis')(express);

// local
var env = require('./util/env'),
	apiRouter = require('./api-router'),
	router = require('./router');

// Setup application
var app = require('./util/app');
env.current.session.store = new RedisStore(env.current.redis);
env.current.session.cookieParser = express.cookieParser;

app.configure(function () {
	app.set('port', env.current.port);

	// Session
	app.use(express.cookieParser());
	app.use(express.session(env.current.session));

	// Enable passport
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// Mount static paths
	env.current.staticMounts.forEach(function (dir) {
		app.use(express.static(path.resolve(dir)));
	});

	app.use(apiRouter());
	app.use(app.router);
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

// Configure passport middleware
require('./util/passport-util');

// Apply all of our routes
router(app, env);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// Start socket services
var io = require('socket.io').listen(server, { log: false });
require('./sockets/mudClient')(io);