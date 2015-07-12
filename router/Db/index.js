"use strict";

var level = require('level');
var db = level('./messages.db');

db.put('name', 'LevelUP', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error

  // 3) fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found

    // ta da!
    console.log('name=' + value)
  })
})

module.exports = {

	addMessage : function(msg) {
	
	}
};