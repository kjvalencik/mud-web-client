angular.module('services.socket', [])

.factory('socket', function ($rootScope, User) {
	var socket = io.connect();

	$rootScope.$on('logged-in', function () {
		try {
			socket.disconnect();
		} catch (e) {}
		socket.socket.connect();
	});

	$rootScope.$on('logged-out', function () {
		try {
			socket.disconnect();
		} catch (e) {}
	});
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});