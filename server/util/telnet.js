// Right now this doesn't really do anything. It just wraps
// a net connection in case we want to do fancier stuff later.

var EventEmitter = require('events').EventEmitter,
	net = require('net'),
	Telnet;

Telnet = function (host, port) {
	var self = this,
		client;

	client = net.connect({ host: host, port: port }, function () {
		self.emit('connection', self);
	});
	client.setEncoding('utf8');

	client.on('close', function () {
		self.emit('close');
	});
	client.on('error', function (err) {
		client.end();
	});
	client.on('data', function (data) {
		self.emit('data', data);
	});

	this.write = function (data) {
		client.write(data);
	};
	this.close = function () {
		client.end();
	};
};
Telnet.prototype = Object.create(EventEmitter.prototype);

module.exports = Telnet;