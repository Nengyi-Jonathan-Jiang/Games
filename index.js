const express = require('express');
/** @type {Express} */
const app = require('express')();
/** @type {http.Server} */
const server = require('http').Server(app);
const fs = require('fs');

const sockets = require("./sockets")(server);

server.listen(3000);

app.use('/files', express.static(__dirname));
app.all('/', function(req, res){res.sendFile(__dirname + '/homepage/index.html')});

let GAMES = fs.readdirSync("./games");

for(let game of GAMES){
	app.all('/' + game, function(req, res){res.sendFile(__dirname + '/games/' + game + '/client/index.html')});
	app.all('/' + game + "/style.css", function(req, res){res.sendFile(__dirname + '/games/' + game + '/client/style.css')});
	app.all('/' + game + "/script.js", function(req, res){res.sendFile(__dirname + '/games/' + game + '/client/script.js')});
}

console.log("Started server");