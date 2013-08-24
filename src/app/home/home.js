angular.module('mud.home', [
	'services.socket',
	'directives.scrollBottom'
])

.config(function config($navsProvider) {
	$navsProvider.nav( 'mud.home', {
		url: '/',
		access: 'free',
		nav: { left: 1 },
		controller: 'HomeCtrl',
		label: 'Home',
		templateUrl: 'home/home.tpl.html'
	});
})

.controller('HomeCtrl', function HomeController($scope, $filter, titleService, socket) {
	// Buffer is in characters
	var buffer = 1000000,
		firstMatchStart = $filter('firstMatchStart'),
		runInternal, write, writeErr,
		isConnected, isConnecting,
		internal, internalList;

	$scope.lines = "";
	write = function (lines) {
		var isBottom = $scope.isBottom();

		if (!_.isArray(lines)) {
			lines = [lines];
		}

		$scope.lines = ($scope.lines + lines.join()).slice(buffer * -1);

		if (isBottom) {
			$scope.scrollBottom();
		}
	};
	writeErr = function (err) {
		write("\n#ERROR: " + err + '\n');
	};

	internal = {
		connect: function (host, port) {
			if (isConnected) {
				writeErr("You must disconnect before making a new connection");
				return;
			}

			write('#connecting');
			isConnecting = true;

			socket.emit('command', {
				cmd: 'connect',
				args: {
					host: host,
					port: port
				}
			});
		},
		disconnect: function () {
			socket.emit('command', {
				cmd: 'disconnect'
			});
		}
	};
	$scope.commands = internal;
	internalList = _.keys(internal).sort();

	runInternal = function (cmd) {
		var args, fn;

		if (cmd.slice(0, 1) !== "#") {
			return false;
		}

		args = cmd.slice(1).split(" ");
		cmd = args.shift();
		fn = internal[firstMatchStart(internalList, cmd)];

		if (!fn) {
			writeErr("Unknown command '" + cmd + "'");
		} else {
			fn.apply(null, args);
		}

		return true;
	};

	$scope.sendCommand = function (cmd) {
		cmd = cmd || '\n';
		$scope.command ="";

		// Run an internal command
		if (runInternal(cmd)) {
			return;
		}

		if (!isConnected) {
			return writeErr("You are not connected");
		}

		// Echo
		write(" " + cmd + "\n");

		// Forward the command
		socket.emit('client', cmd);
	};

	socket.on('state', function (state) {
		isConnecting = false;
		switch (state) {
		case "connected":
			isConnected = true;
			break;
		case "disconnected":
			isConnected = false;
			write('\n#disconnected\n');
			break;
		}
	});

	socket.on('client', function (data) {
		write(data);
	});
})

;