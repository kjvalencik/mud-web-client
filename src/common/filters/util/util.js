angular.module('filters.util', [
	'ng'
])

.filter('regexEscape', function matchFilter () {
	var specialChars = new RegExp('([\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:\\-\\\\])', 'g');
	return function (input) {
		return input.replace(specialChars, "\\$1");
	};
})

.filter('match', function matchFilter ($filter) {
	var regexEscape = $filter('regexEscape');
	return function (input, query) {
		query = query || "";
		return input.replace(new RegExp('('+ regexEscape(query) + ')', 'ig'), '<span class="match">$1</span>');
	};
})

.filter('firstMatchStart', function ($filter) {
	var regexEscape = $filter('regexEscape');
	return function (arr, filter) {
		var reg = new RegExp("^" + regexEscape(filter)),
			i;
		for (i = 0; i < arr.length; i++) {
			if (reg.test(arr[i])) {
				return arr[i];
			}
		}
	};
})

// has - Check for an object having a key or list of keys
// filters an array context using a string key or list of string keys
// which can be $parse expressions.
.filter('has', function definedFilter ($parse) {
	return function (seq, expr) {
		if (!_.isArray(expr)) {
			expr = [expr];
		}
		var gets = _.map(expr, $parse);
		return _.filter(seq, function (x) {
			return _.every(gets, function (g) {
				return g(x) !== undefined;
			});
		});
	};
})

;