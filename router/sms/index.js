"use strict";

var path = require('path');
var env = require('../../config');
var twilio = require('twilio');
var twilioAPI = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);

var Db = require('../Db');

module.exports = function(server) {
		
	var smsUrl = env.URL + '/smswebhook');
	
	console.log("***", smsUrl);

	// Set up the webhook. If it doesn't succeed the bound
	// route will never be called.
	//
	twilioAPI.incomingPhoneNumbers(env.TWILIO_PHONE_NUMBER_SID).update({
		smsUrl: smsUrl
	});	
	
	server.post('/smswebhook', function(req, res) {

		var twiml = new twilio.TwimlResponse();

		twiml.message("HIYO from TWILLIO");
		
		res.writeHead(200, { 
			'Content-Type':'text/xml' 
		});
		
		res.end(twiml.toString());
	});
};

/*


// 2) put a key & value
db.put('name', 'LevelUP', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error

  // 3) fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found

    // ta da!
    console.log('name=' + value)
  })
})

twilio post body sent to hook

ToCountry=US
&ToState=NY
&SmsMessageSid=SM3b3c68b39785c9c19e2cddf1332bba1e
&NumMedia=0
&ToCity=SOUTH+RICHMOND+HILL
&FromZip=11575
&SmsSid=SM3b3c68b39785c9c19e2cddf1332bba1e
&FromState=NY&SmsStatus=received
&FromCity=SOUTH+RICHMOND+HILL
&Body=Hi
&FromCountry=US
&To=%2B13479604874
&ToZip=11435
&MessageSid=SM3b3c68b39785c9c19e2cddf1332bba1e
&AccountSid=ACb654b198d890e14869d7839697365347
&From=%2B19177674492
&ApiVersion=2010-04-01

*/