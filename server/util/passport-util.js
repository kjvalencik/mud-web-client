var passport = require('passport'),
	GoogleStrategy = require('passport-google').Strategy,
	async = require('async'),
	_ = require('underscore'),
	env = require('./env'),
	redisUtil = require('./redis-util'),
	app = require('./app'),
	client = redisUtil.createClient();

// Serialize / deserialize the user
passport.serializeUser(function (user, done) {
	var key = user.id;
	if (user.username) {
		key = user.username.toLowerCase();
	}
	return done(null, key);
});
passport.deserializeUser(function (username, done) {
	client.hget(['users', username], function (err, user) {
		if (err) {
			return done(err);
		}

		try {
			user = JSON.parse(user);
		} catch (e) {
			return done(e);
		}

		return done(null, user);
	});
});

// Configure the Google passport strategy
passport.use(new GoogleStrategy({
	returnURL : env.current.host + '/api/auth/google/return',
	realm     : env.current.host + '/'
}, function (id, profile, done) {
	// Look for the user's id from the identifier
	client.hget(['users-id', id], function (err, username) {
		var user;

		if (err) {
			return done(err);
		}

		// Get the user from the identifier
		if (username) {
			return client.hget(['users', username], function (err, user) {
				if (err) {
					return done(err);
				}
				try {
					user = JSON.parse(user);
				} catch (e) {
					return done(e);
				}
				return done(null, user);
			});
		}

		// Otherwise, create a new user, we don't have a username yet,
		// so just use the id as the key.
		user = {
			first : profile.name.givenName,
			last  : profile.name.familyName,
			email : profile.emails[0].value,
			id    : id
		};
		async.parallel([function (cb) {
			client.hset(['users-id', id, id], function (err) {
				cb(err);
			});
		}, function (cb) {
			client.hset(['users', id, JSON.stringify(user)], function (err) {
				cb(err);
			});
		}], function (err) {
			done(err, user);
		});
	});
}));

// Express routes
app.get('/api/auth/fail', function (req, res) {
	res.send('<script>window.opener.oauthCallback();</script>');
});
app.get('/api/auth/google', passport.authenticate('google'));
app.get('/api/auth/google/return', passport.authenticate('google', { failureRedirect: '/api/auth/fail' }), function (req, res) {
	var user = _.pick(req.user, 'username');
	user.authenticated = true;
	res.send('<script>window.opener.oauthCallback(' + JSON.stringify(user) + ');</script>');
});