// routes.js
// Provides basic html routes

// builtin
var path = require('path');

module.exports = function (app) {
	var base = app.get('env') === 'production' ? 'bin' : 'build';

	app.get('/', function (req, res) {
		res.sendfile(path.resolve(path.join(base, 'index.html')));
	});

	app.get(/\/route(\/.*)/, function (req, res) {
		res.redirect('/#' + req.params[0]);
	});
};