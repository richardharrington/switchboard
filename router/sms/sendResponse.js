"use strict";

var env = require('../../config');
var twilio = require('twilio');
var twilioAPI = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);

module.exports = function(number, message) {

	twilioAPI.sendMessage({
		to: number, 
		from: env.TWILIO_DEFAULT_FROM,
		body: message 
	}, function(err, responseData) {
		if(err) { 
			return;
		}
	
		console.log(responseData); 
		console.log(responseData); 
	});
};


/*

		var twiml = new twilio.TwimlResponse();

		twiml.message("HIYO from TWILLIO");
		
		res.writeHead(200, { 
			'Content-Type':'text/xml' 
		});
		
		res.end(twiml.toString());
*/