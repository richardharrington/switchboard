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
server.listen(env.PORT, function() {});

// Configure the socket listener for client connections
//
var net = require('net');
 
var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});
 
/*
server.listen(env.SOCK_PORT, function() {
	var client = new net.Socket();
	client.connect(env.PORT, env.URL, function() {
		console.log('Connected');
		client.write('Hello, server! Love, Client.');
	});
	 
	client.on('data', function(data) {
		console.log('Received: ' + data);
		client.destroy(); // kill client after server's response
	});
	 
	client.on('close', function() {
		console.log('Connection closed');
	});
});
*/

