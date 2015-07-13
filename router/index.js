"use strict";

var restify = require('restify');
var SServer = require("ws").Server;
var env = require('../config');
var npmpack = require('../package.json');

var sendSMSResponse = require('./sms/sendResponse.js');

// Add in the client mapping API (who needs work, who is working...)
//
var Clients = require('./clientMap.js');

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
	
	wss.on("connection", function(clientConn) {
		
		console.log("websocket connection opened.")
				
		clientConn.on("close", function() {
			console.log("websocket connection closed.");
			
			// Remove client from system
			//
			Clients.delete(clientConn);
		});
		
		clientConn.on("message", function(payload) {
		
			console.log("Got message from client server: ", payload);
			
			try {
				payload = JSON.parse(payload);
			} catch(e) {
				return;
			}
			
			switch(payload.type) {
				case 'available':
				
					// This connection wants new work
					//
					Client.set(clientConn, 'available');
				
				break;
				
				case 'response':
					var number = Client.get(clientConn);
					if(!number) {
						// Why is client sending a response if not bound to 
						// a number?
					} else {
						db.addToNumberHistory(number, { 
							body: payload.msg
						});
					}
				break;
				
				default: 
					// probably ping
				break;
			}
		});
		
		// Create a Client entry
		//
		Clients.set(clientConn, 'available');
		
		// We need to be notified when a new message has been
		// added.
		//
		dbStream.on('data', function(data) {
		
		console.log("STREAMDATA:", data);
		
			var number = data.key;
			var val = data.value;
			var type = data.type; // typically `put`
			
			// Find any clients that are listening on this number
			//
			var boundClient = Clients.withNumber(number);
			
			// Send the current history to this client
			//
			if(boundClient) {
			
console.log("Client with existing number getting messages");

				return boundClient.send(JSON.stringify({
					type: 'update',
					list: val
				}));
			}
			
			// Try to find an available client
			//
			var waitingClient = Clients.nextAvailable();
			if(waitingClient) {

console.log("Client assigned a number");

				// This client is no longer `available`. Assign client a number.
				// Then send number history.
				//
				Clients.set(clientConn, number);
			
				waitingClient.send(JSON.stringify({
					type: 'update',
					list: val
				}));
			}
		});
		dbStream.on('error', function(err) {
			console.log("STREAMERROR:", err);
		});
		
		// Say something nice
		//
		clientConn.send('How can I help you?');
	});
});

