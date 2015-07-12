"use strict";

var level = require('level');
var db = level('./messages.db');

var readStream;

module.exports = {

	addMessage : function(msg) {
	
	},
	
	getReadStream : function() {
		if(!readStream) {
			readStream = db.createReadStream();
		}
		return readStream;
	}
};