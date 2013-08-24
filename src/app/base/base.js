angular.module('mud.base', [
	'providers.nav',
	'ui.bootstrap',
	'services.user'
])

.config(function ConfigureBaseState ($navsProvider) {
	$navsProvider.nav('mud', {
		views: {
			'header': {
				controller: 'HeaderCtrl',
				templateUrl: 'base/header.tpl.html'
			},
			'main': {
				controller: 'MainCtrl',
				templateUrl: 'base/main.tpl.html'
			}
		}
	});
})

.controller('MainCtrl', function MainCtrl() {})

.controller('HeaderCtrl', function ($scope, $dialog, $navs, User) {
	var dialogOpts = {
		backdrop: true,
		keyboard: true,
		backdropClick: true,
		templateUrl:  'base/login.tpl.html',
		controller: 'LoginCtrl',
		dialogClass: 'modal login-modal'
	};

	$scope.user = User.getUser();
	$scope.states = $navs.arr;

	$scope.login = function () {
		$dialog.dialog(dialogOpts).open();
	};
	$scope.logout = function () {
		User.logout();
	};
})

.controller('LoginCtrl', function ($scope, dialog, User) {
	var popup;

	$scope.user = User.getUser();

	// Ugly callback on the window for OAuth
	// Important: This function must be recreated each time so that
	// the popup and user are in the current closure.
	window.oauthCallback = function oauthCallback(user) {
		popup.close();
		if (user) {
			User.set(user);

			// If a username already exists, complete the login
			if (user.username) {
				return dialog.close();
			}
		}
	};

	$scope.submit = function (username) {
		User.createUsername(username, function (err) {
			if (!err) {
				return dialog.close();
			}

			// Don't show a 412, because they aren't logged in anymore
			if (err.status === 412) {
				return;
			}

			$scope.alert = err.data;
		});
	};
	$scope.closeAlert = function () {
		$scope.alert = null;
	};
	$scope.close = function () {
		dialog.close();
	};
	$scope.login = function (url) {
		popup = window.open(url, 'Google Login', 'width=900,height=500', true);
	};
})

;
