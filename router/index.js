"use strict";

var restify = require('restify');

var env = require('../config');
var npmpack = require('../package.json');

var server = restify.createServer({
	name: npmpack.name,
	version: npmpack.version
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', function(req, res) {
	res.send(200, 'ok');
});

// Configure the sms webhook routing
//
require('./sms')(server);

// process.env.PORT is set by heroku (add it yourself if hosting elsewhere)
//
server.listen(env.PORT, function() {
	console.log('%s listening at %s', server.name, server.url);
});

// Configure the socket listener for client connections
//
var net = require('net');
 
var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});
 
server.listen(env.SOCK_PORT);