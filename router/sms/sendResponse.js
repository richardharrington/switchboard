"use strict";

var Promise = require('bluebird');
var env = require('../../config');
var twilio = require('twilio');
var twilioAPI = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);

module.exports = function(number, message) {

	return new Promise(function(resolve, reject) {
		twilioAPI.sendMessage({
			to: number, 
			from: env.TWILIO_DEFAULT_FROM,
			message: message 
		}, function(err, responseData) {
			if(err) { 
				return reject(err);
			}
			resolve(responseData);
		});
	});
};


/*

		
sendSMSResponse('+19177674492', 'Hi Sandro')
.then(function(resp) {
	console.log('SENT MESSAGE:', resp);
})
.catch(console.log.bind(console));



var twiml = new twilio.TwimlResponse();

twiml.message("HIYO from TWILLIO");

res.writeHead(200, { 
	'Content-Type':'text/xml' 
});

res.end(twiml.toString());
		
*/