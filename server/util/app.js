// Wrap Express app so that we can use require instead of passing it around
var express = require('express'),
	app = express();

module.exports = app;