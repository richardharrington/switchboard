"use strict";

var restify = require('restify');
var SServer = require("ws").Server;
var env = require('../config');
var npmpack = require('../package.json');

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

// Get the LevelDB interface, and its readable stream
//
require('./Db')(function(db, dbApi) {

	// Configure the sms webhook routing
	//
	require('./sms')(server, dbApi);
	
	var dbStream = require('level-live-stream')(db);
	
	// Configure the socket listener for client connections
	//
	var wss = new SServer(server);
	var clientSocket;
	
	wss.on("connection", function(ws) {
		
		console.log("websocket connection opened.")
		
		ws.on("close", function() {
			console.log("websocket connection closed.");
		});
		
		ws.on("message", function(msg) {
			console.log("Got message from client server: ", msg);
		});


		// We need to be notified when a new message has been
		// added.
		//
		dbStream.on('data', function(data) {
			console.log("STREAMDATA:", data);
		});
		dbStream.on('error', function(err) {
			console.log("STREAMERROR:", err);
		});
		
		
		ws.send('How can I help you?');
		
		sendSMSResponse('+19177674492', 'Hi Sandro')
		.then(function(resp) {
			console.log('SENT MESSAGE:', resp);
		})
		.catch(console.log.bind(console));
	});
});

