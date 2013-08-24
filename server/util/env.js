var env = process.env.NODE_ENV || 'development',
	_ = require('underscore');

exports.get = function(env) {
	var defaults = require('../../config/' + env).config,
		local;

	try {
		local = require('../../config/local').config;
	} catch (e) {
		local = {};
	}

	return _.extend(defaults, local);
};

exports.name = env;
exports.current = exports.get(env);