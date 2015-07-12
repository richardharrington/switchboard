"use strict";

var Promise = require('bluebird');
var level = require('level');
var db = level('./messages.db');

var readStream;

module.exports = {

	addToNumberHistory : function(number, meta) {
	
	console.log("ADDING TO HISTORY:", arguments);
	
		return new Promise(function(resolve, reject) {
			db.get(number, function(err, val) {
				if(err) {
					if(!err.notFound) {
						return reject(new Error('Unable to add message from ' + number + ' to message history'));
					}
					
					return db.put(number, [meta], function(err, resp) {
						if(err) {
							return reject(err);
						}
						resolve(resp);
					});
				} 
				db.get(number, function(err, val) {
					if(err) {
						return reject(err);
					}
					resolve(val);
				});
			});
		});
	},
	
	getReadStream : function() {
		if(!readStream) {
			readStream = db.createReadStream();
		}
		return readStream;
	},
	
	getConnection : function() {
		return db;
	}
};