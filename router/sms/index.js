"use strict";

var path = require('path');
var env = require('../../config');
var twilio = require('twilio');
var twilioAPI = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);

// Get the LevelDB interface
//
var db = require('../Db');

module.exports = function(server) {
		
	var smsUrl = env.URL + '/smswebhook';

	// Set up the webhook. If it doesn't succeed the bound
	// route will never be called.
	//
	twilioAPI.incomingPhoneNumbers(env.TWILIO_PHONE_NUMBER_SID).update({
		smsUrl: smsUrl
	});	
	
	server.post('/smswebhook', function(req, res) {
	
		var dat = req.params;

		var meta = {
			body		: dat.Body,
			fromState	: dat.FromState,
			fromCountry	: dat.FromCountry,
			sid			: dat.MessageSid
		}
		
		db.addToNumberHistory(dat.From, meta)
		.then(function(resp) {
			console.log('Received message from', dat.From);
			
			db.connection.get(dat.From, {
				valueEncoding : 'json'
			}, function(err, val) {
				if(err) {
					throw new Error(err);
				}
				console.log("typ:", typeof val);
				console.log('Got value:', val);
			})
		})
		.catch(function(err) {
			console.log("levelERRR:", err);
		})
		
		res.end();
	});
};

/*

twilio post body sent to hook

ToCountry=US
&ToState=NY
&SmsMessageSid=SM3b3c68b39785c9c19e2cddf1332bba1e
&NumMedia=0
&ToCity=SOUTH+RICHMOND+HILL
&FromZip=11575
&SmsSid=SM3b3c68b39785c9c19e2cddf1332bba1e
&FromState=NY
&SmsStatus=received
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