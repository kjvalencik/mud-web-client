
// vendor
var Api = require('api-routes');

module.exports = function () {
	var api = new Api('/api');

	api.requireAll({
		dirname: __dirname + '/routes'
	});

	// Return the middleware
	return api.router;
};