"use strict";

var level = require('level');
var db = level('./messages.db');

var readStream;

module.exports = {

	addToNumberHistory : function(number, meta) {
		db.get(number, function(err, val) {
			if(err) {
				if(!err.notFound) {
					return;
				}
				
				return db.put(number, [meta]);
			}
			
		});
	},
	
	getReadStream : function() {
		if(!readStream) {
			readStream = db.createReadStream();
		}
		return readStream;
	}
};