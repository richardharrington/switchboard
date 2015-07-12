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

// Configure the sms webhook routing
//
require('./sms')(server);

server.listen(env.HTTP_PORT, env.URI, function() {
	console.log('%s listening at %s', server.name, server.url);
});

// Configure the socket listener for client connections
//
var net = require('net');
 
var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});
 
server.listen(env.SOCK_PORT, env.URI);