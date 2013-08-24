var redis = require('redis'),
	env = require('./env');

exports.createClient = function createClient() {
	return redis.createClient(env.current.redis.port, env.current.redis.host,
		env.current.redis.host.options);
};