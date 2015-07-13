"use strict";

var Promise = require('bluebird');
var level = require('level');

module.exports = function(cb) {
	level('./messages.db', {
		valueEncoding : 'json'
	}, function(err, db) {
	
		if(err) {
			throw new Error(err);
		}
	
		cb(db, {
		
			addToNumberHistory : function(number, meta) {
			
			console.log("ADDING TO HISTORY:", arguments);
				
				return new Promise(function(resolve, reject) {
					db.get(number, function(err, val) {
						if(err) {
							if(!err.notFound) {
								return reject(new Error('Unable to add message from ' + number + ' to message history'));
							}
							
							var val = [meta];
							
							return db.put(number, val, function(err, resp) {
								if(err) {
									return reject(err);
								}
								resolve(val);
							});
						} 
						
						val.push(meta);
						
						db.put(number, val, function(err, resp) {
							if(err) {
								return reject(err);
							}
							resolve(val);
						});
					});
				});
			}
		});
	});
};