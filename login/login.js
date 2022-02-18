const express = require('express');
const session = require('express-session');
const path = require('path');

module.exports = /** @param {Express} app*/ function(app){
	const db = require('../db');
	app.use(session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	}));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname, 'static')));
	app.get('/', function(req, res){res.redirect('/login')});
	app.get('/login', function(req, res){res.sendFile(path.join(__dirname + '/index.html'))});
	app.get('/signup', function(req, res){res.sendFile(path.join(__dirname + '/signup.html'))});

	function isValidLogin(username,password){
		for(let i of db.data.accounts){
			console.log(i,username,Buffer.from(password).toString('base64'));
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

	app.post('/auth', function(req, res) {
		let username = req.body.username;
		let password = req.body.password;
		if (username && password) {
			if (isValidLogin(username, password)) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/home');
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
			req.session.loggedin = true;
			req.session.username = username;
			res.redirect('/home');
			res.end();
		} else {
			res.redirect('/login#invalidlogin');
			res.end();
		}
	});

	app.get('/home', function(req, res) {
		if (req.session.loggedin)
			// res.send(`Hi ${req.session.username}`)
			res.sendFile((__dirname + '/homepage/index.html'));
		else{res.redirect('/login'); res.end()}
	});

	app.listen(3000);	
}

module.exports(require('express')());