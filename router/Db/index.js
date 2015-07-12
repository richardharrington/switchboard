"use strict";

var Promise = require('bluebird');
var level = require('level');
var db = level('./messages.db');

var readStream;

module.exports = {

	addToNumberHistory : function(number, meta) {
	
	console.log("ADDING TO HISTORY:", arguments);
		
		return new Promise(function(resolve, reject) {
			db.get(number, {
				valueEncoding : 'json'
			}, function(err, val) {
				if(err) {
					console.log("err***", err);
					if(!err.notFound) {
						return reject(new Error('Unable to add message from ' + number + ' to message history'));
					}
					
					return db.put(number, [meta], {
						valueEncoding : 'json'
					}, function(err, resp) {
						if(err) {
							return reject(err);
						}
						resolve(resp);
					});
				} 
	console.log("val *****", val);
				val.push(meta);
				
				console.log(val);
				
				db.put(number, meta, {
					valueEncoding : 'json'
				}, function(err, resp) {
					if(err) {
						return reject(err);
					}
					resolve(resp);
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
	
	connection : db
};