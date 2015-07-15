"use strict";

var restify = require('restify');
var SServer = require("ws").Server;
var env = require('../config');
var npmpack = require('../package.json');

var sendSMSResponse = require('./sms/sendResponse.js');

// Add in the client mapping API (who needs work, who is working...)
//
var Clients = require('./clientMap.js');

var server = restify.createServer({
  name: npmpack.name,
  version: npmpack.version
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', function(req, res) {
  res.send(200, 'ok');
});

// process.env.PORT is set by heroku (add it yourself if hosting elsewhere)
//
server.listen(env.PORT, function() {});

// Get the LevelDB interface, and its readable stream
//
require('./Db')(function(db, dbApi) {

  // Configure the sms webhook routing
  //
  require('./sms')(server, dbApi);

  // Configure a leveldb datastream listener which has the job
  // of informing clients of data changes.
  //
  require('./dataStream.js')(db, Clients);

  // Configure the socket listener for client connections
  //
  var wss = new SServer(server);
  var clientSocket;

  wss.on("connection", function $wssOnConnection(clientConn) {

    console.log("websocket connection opened.")

    clientConn.on("close", function() {
      console.log("websocket connection closed.");

      // Remove client from system
      //
      Clients.delete(clientConn);

      clientConn = null;
    });

    clientConn.on("message", function $clientConnOnMessage(payload) {

      console.log("Got message from client server: ", payload);

      try {
        payload = JSON.parse(payload);
      } catch(e) {
        return;
      }

      switch(payload.type) {
        case 'available':

          // This connection wants new work
          //
          Client.set(clientConn, 'available');

        break;

        case 'response':

        break;

        default:
          // ignore
        break;
      }
    });

    // Create a Client entry
    //
    Clients.set(clientConn, 'available');

    // Say something nice
    //
    clientConn.send(JSON.stringify({
      type: 'alert',
      text: 'How can I help you?'
    }));
  });
});

