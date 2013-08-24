angular.module('filters.navs', [])

// Filters for navs that have a state
.filter('hasRoute', function () {
	return function (states) {
		return _.filter(states, function (state) {
			return state.url && state.nav;
		});
	};
})

// Filters for authenticated navs
.filter('auth', function (User) {
	return function (states) {
		var set = ['free'];

		// Make sure the user is authenticated
		if (User.isAuthenticated()) {
			set = _.union(set, ['authenticated'], User.getUser().permissions);
		} else {
			set.push('unauthenticated');
		}

		return _.filter(states, function (state) {
			return _.contains(set, state.access);
		});
	};
})

.filter('isActive', function ($state) {
	return function (states) {
		var ret = _.map(states, function (state) {
			state.active = $state.includes(state.name);
			return state;
		});
		return ret;
	};
});