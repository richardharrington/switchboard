"use strict";

var restify = require('restify');
var SServer = require("ws").Server;
var env = require('../config');
var npmpack = require('../package.json');

// Get the LevelDB interface, and its readable stream
//
var db = require('./Db');
var dbStream = db.connection.createReadStream();

var sendSMSResponse = require('./sms/sendResponse.js');

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

// process.env.PORT is set by heroku (add it yourself if hosting elsewhere)
//
server.listen(env.PORT, function() {});

// Configure the sms webhook routing
//
require('./sms')(server, db);

// Configure the socket listener for client connections
//
var wss = new SServer(server);
var clientSocket;

wss.on("connection", function(ws) {
	
	ws.send('How can I help you?');

	console.log("websocket connection opened.")
	
	sendSMSResponse('+19177674492', 'Hi Sandro')
	.then(function(resp) {
		console.log('SENT MESSAGE:', resp);
	})
	.catch(console.log.bind(console));
	
	ws.on("close", function() {
		console.log("websocket connection closed.");
	});
	
	console.log(dbStream);
	
	dbStream.on('data', function(data) {
		console.log("STREAMDATA:", data);
	});
	dbStream.on('error', function(err) {
		console.log("STREAMERROR:", err);
	});
});

