var Telnet = require('../util/telnet'),
	AnsiConverter = require('ansi-to-html'),
	ansiConverter = new AnsiConverter(),
	escapeHtml;

// Minimal escape html function
// We explicitly do not want to touch newlines
escapeHtml = (function () {
	var amp = new RegExp("&", "g"),
		ampStr = '&amp;',
		lt = new RegExp("<", "g"),
		ltStr = '&lt;',
		gt = new RegExp(">", "g"),
		gtStr = "&gt;",
		car = new RegExp("\\r", "g"),
		carStr = "";

	return function (str) {
		return str.replace(amp, ampStr)
			.replace(lt, ltStr)
			.replace(gt, gtStr)
			.replace(car, carStr);
	};
}());

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		var isConnected = false,
			isConnecting = false,
			commands = {},
			telnet;

		commands.connect = function (args) {
			if (!isConnected && !isConnecting) {
				isConnecting = true;
				telnet = new Telnet(args.host, args.port);

				// Let the client know we are connected
				telnet.on('connection', function () {
					isConnected = true;
					isConnecting = false;
					socket.emit('state', 'connected');
				});

				// Let the client know we lost the connection
				telnet.on('close', function () {
					telnet = null;
					isConnected = false;
					isConnecting = false;
					socket.emit('state', 'disconnected');
				});

				// Forward data to the client
				telnet.on('data', function (data) {
					socket.emit('client', ansiConverter.toHtml(escapeHtml(data)));
				});
			}
		};
		commands.disconnect = function () {
			if (telnet) {
				telnet.close();
			}
		};

		socket.on('disconnect', function () {
			if (telnet) {
				telnet.close();
			}
		});

		socket.on('client', function (data) {
			console.log(isConnected);
			console.log(data);
			if (isConnected) {
				telnet.write(data + '\n');
			}
		});

		socket.on('command', function (data) {
			var cmd = commands[data.cmd];
			if (cmd) {
				cmd(data.args);
			}
		});
	});
};
