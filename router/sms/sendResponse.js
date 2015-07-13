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
			body: message 
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
		
		
id: 'SMe6d6c72353714810a4fdf28d2f440777',
2015-07-12T19:52:53.933818+00:00 app[web.1]:   date_created: 'Sun, 12 Jul 2015 19:52:53 +0000',
2015-07-12T19:52:53.933820+00:00 app[web.1]:   date_updated: 'Sun, 12 Jul 2015 19:52:53 +0000',
2015-07-12T19:52:53.933821+00:00 app[web.1]:   date_sent: null,
2015-07-12T19:52:53.933823+00:00 app[web.1]:   account_sid: 'ACb654b198d890e14869d7839697365347',
2015-07-12T19:52:53.933824+00:00 app[web.1]:   to: '+19177674492',
2015-07-12T19:52:53.933826+00:00 app[web.1]:   from: '+13479604874',
*/