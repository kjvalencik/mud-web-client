var version = '0.0.1'; // TODO move to package.json

module.exports = function (api) {
	api.endpoint('version', {
		url: '/version',
		get: function (req, res) {
			res.send({version: version});
		}
	});
};