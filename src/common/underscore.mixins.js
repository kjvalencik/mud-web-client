if (!_) {
	var _ = require('underscore');
}

_.mixin({
	cycle: function (seq, n) {
		return _.flatten(_.map(_.range(n || 0), function () {
			return seq;
		}));
	},
	repeat: function (val, n) {
		return _.cycle([val], n);
	},
	sum: function (seq) {
		return _.reduce(seq, function(a,b) { return a+b; }, 0);
	},
	set: function (seq) {
		// Take a sequence of values and produce an object of value -> 1
		return _.object(seq, _.repeat(1, seq.length));
	},
	aggregate: function (seq) {
		return _.reduce(seq, function (memo, a) {
			return memo.concat([(memo.length ? _.last(memo) : []).concat([a])]);
		}, []);
	},
	aggjoin: function (seq, sep) {
		return _.map(_.aggregate(seq), function (s) { return s.join(sep); });
	},
	lower: function (s) {
		return s.toLowerCase();
	},
	upper: function (s) {
		return s.toUpperCase();
	},
	queryfy: function (obj) {
		return _.map(obj, function (val, key) {
			return key + '=' + val;
		}).join('&');
	},
	extendPrototype: (function () {
		var Surrogate = function () {};
		return function (Sub, Super) {
			Surrogate.prototype = Super.prototype;
			Sub.prototype = new Surrogate();
			Sub.prototype.constructor = Sub;
			return Sub;
		};
	}())
});