const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const fs = require('fs');

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

app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
        if (username == "JJ" && password == "264") {
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
	if (username && password) {
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
	if (req.session.loggedin) res.send(`Hi ${req.session.username}`)//res.sendFile('C:/Users/K1334755/Desktop/Projects/Other/Games/homepage/index.html')
	else{res.redirect('/login'); res.end()}
});

app.listen(3000);