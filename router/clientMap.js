"use strict";

// Stores all clients:
// key: web socket object
// val: state [one of 'available' | 'assigned']
//
var clients = new Map();

module.exports = {

	exists: function(sock) {
		return clients.has(sock);
	},
	
	nextAvailable: function(sock) {
		var iter = clients.entries();
		var arr;
		while(arr = iter.next().value) {
			if(arr[1] === 'available') {
				return arr[0];
			}
		}
	},
	
	withNumber: function(number) {
		var iter = clients.entries();
		var arr;
		while(arr = iter.next().value) {
			if(arr[1] === number) {
				return arr[0];
			}
		}	
	},
	
	set: function(sock, status) {
		clients.set(sock, status);
	},
	
	delete: function(sock) {
		clients.delete(sock);
	}
};