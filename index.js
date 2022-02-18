const express = require('express');
const session = require('express-session');
const fs = require('fs');
const db = require('./db');
const socketio = require('socket.io');
const path = require('path');

/** @type {Express} */
const app = require('express')();
/** @type {http.Server} */
const server = require('http').Server(app);
/** @type {socketio.Server} */
const io = require('socket.io')(server);

app.use(session({secret: 'secret',resave: true,saveUninitialized: true}));

// #region login stuff



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/login/style.css', function(req,res){res.sendFile(__dirname + '/login/style.css')});
app.get('/', function(req, res){res.redirect('/login')});
app.get('/login', function(req, res){res.sendFile(path.join(__dirname + '/login/login.html'))});
app.get('/signup', function(req, res){res.sendFile(path.join(__dirname + '/login/signup.html'))});

function isValidLogin(username,password){
	for(let i of db.data.accounts){
		if(i.username == username && i.password == Buffer.from(password).toString('base64')){
			return true;
		}
	}
	return false;
}
function createAccount(username,password){
	if(db.data.accounts.find(i=>i.username == username)){
		return false;
	}
	db.data.accounts.push({
		username: username,
		password: Buffer.from(password).toString('base64'),
	});
	db.saveData();
	return true;
}
function loginAndRedirectToHome(req,res,username){
	req.session.loggedin = true;
	req.session.username = username;
	res.redirect('/home#'+JSON.stringify({
		username: req.session.username
	}));
}

app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		if (isValidLogin(username, password)) {
			loginAndRedirectToHome(req,res,username);
		} else {
			res.redirect('/login#invalidlogin');
		}			
		res.end();
	} else {
		res.redirect('/login#invalidlogin');
		res.end();
	}
});

app.post('/auth-signup', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password && createAccount(username, password)) {
		loginAndRedirectToHome(req,res,username);
	} else {
		res.redirect('/signup#invalidsignup');
		res.end();
	}
});

server.listen(3000);

// #endregion

app.use('/files', express.static(__dirname));
app.get('/homepage/style.css',function(req,res){res.sendFile(__dirname+'/homepage/style.css')});
app.get('/home', function(req, res) {
	if (req.session.loggedin){
		res.sendFile((__dirname + '/homepage/index.html'));
	}
	else{
		res.redirect('/login');
		res.end()
	}
});

app.get('/get-acc-info', function(req, res){
	console.log(req, req.session);
	res.send(JSON.stringify(req.session))
})

let GAMES = fs.readdirSync("./games");

for(let game of GAMES){
	app.all('/' + game, function(req, res){res.sendFile(__dirname + '/games/' + game + '/client/index.html')});
	app.all('/' + game + "/style.css", function(req, res){res.sendFile(__dirname + '/games/' + game + '/client/style.css')});
	app.all('/' + game + "/script.js", function(req, res){res.sendFile(__dirname + '/games/' + game + '/client/script.js')});
	(f=>{if(typeof f == 'function') f(io)})(require('./games/' + game + '/server/game'));
}

console.log("Started server");