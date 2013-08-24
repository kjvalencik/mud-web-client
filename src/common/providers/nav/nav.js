angular.module('providers.nav', [
	'ui.state'
])

.provider('$navs', function ($stateProvider) {
	var navs = [],
		navsObj = {};

	function extend(name, nav) {
		var parentNames = _.aggjoin(_.initial(name.split('.')), '.');
		var parents = _.map(parentNames, function (p) {
			return navsObj[p] || {};
		});

		var base = _.extend.apply(null, [{}].concat(parents));
		nav = _.extend(_.omit(base, 'controller', 'template', 'templateUrl', 'abstract', 'nav', 'views'), nav);

		if (nav.url !== undefined) {
			nav.url = (base ? (base.url || '') : '') + nav.url;
		}

		return nav;
	}

	var $navsProvider = {
		nav: function AddNav(name, stateConfig) {
			$stateProvider.state(name, stateConfig);
			stateConfig = extend(name, stateConfig);

			navs.push(stateConfig);
			navsObj[name] = stateConfig;


			return $navsProvider;
		},
		$get: function () {
			return {
				arr: navs,
				obj: navsObj
			};
		}
	};

	return $navsProvider;
});