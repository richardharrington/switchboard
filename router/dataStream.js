"use strict";

module.exports = function(db, Clients) {

	var dbStream = require('level-live-stream')(db);
	
	// We need to be notified when a new message has been
	// added.
	//
	dbStream.on('data', function(data) {
	
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

			try {
				return boundClient.send(JSON.stringify({
					type: 'update',
					list: val
				}));
			} catch(e) {
				Clients.delete(boundClient);
			}
		}
		
		// Try to find an available client
		//
		var waitingClient = Clients.nextAvailable();
		if(waitingClient) {

			console.log("Client assigned a number");

			// This client is no longer `available`. Assign client a number.
			// Then send number history.
			//
			Clients.set(waitingClient, number);
		
			waitingClient.send(JSON.stringify({
				type: 'update',
				list: val
			}));
		}
	});
	dbStream.on('error', function(err) {
		console.log("STREAMERROR:", err);
	});
};