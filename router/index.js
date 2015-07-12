"use strict";

var restify = require('restify');

var env = require('../config');
var npmpack = require('../package.json');

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

// Configure the sms webhook routing
//
require('./sms')(server);

// process.env.PORT is set by heroku (add it yourself if hosting elsewhere)
//
server.listen(env.PORT, function() {});

// Configure the socket listener for client connections
//
var WebSocketServer = require("ws").Server;

var wss = new WebSocketServer(server);

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})

