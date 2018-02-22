var express = require('express');
var router = express.Router();

var arxiv = require('../lib/get-papers.js');
var UserAuth = require('../lib/user-auth.js');

router.get('/', function(req, res, next) {
	///:id?prefix=cs.AI&sortBy=submittedDate&sortOrder=descending&maxResults=25&start=0
	var subjectId = 'all';
	var pageNum = req.query.page;
	
	arxiv.getSubjectsPapers(subjectId, pageNum, req.query, function(err, papers) {
		res.render('index', {
			isAuthenticated: req.session.isAuthenticated,
			title: "Arxival",
			papers: papers,
			pageNum: pageNum,
			error: err,
		});
	});
});

router.post('/register', function(req, res, next) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;

	if(!(username && email && password)) {
		res.send({error: 'Please provide a username, email, and password'});
	}

	UserAuth.registerUser(username, email, password, function(err, user) {
		if (!err) {
			// Set session info
			req.session.isAuthenticated = true;
			req.session.username = user.username;

			res.redirect('/user/feed');
		} else {
			res.render('register', {
				title: "Arxival - Register", 
				error: err,
				username: username,
				email: email
			});
		}
	});
});

router.get('/register', function(req, res, next) {
	res.render('register', {
				title: "Arxival - Register", 
			});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		title: "Arxival - Register", 
	});
});

router.post('/login', function(req, res, next) {
	var usernameOrEmail = req.body.usernameOrEmail;
	var password = req.body.password;

	if(!(usernameOrEmail && password)) {
		res.send({error: 'Please provide a username/email and password'});
	}

	UserAuth.loginUser(usernameOrEmail, password, function(err, user) {
		if (!err) {
			// Set session info
			req.session.isAuthenticated = true;
			req.session.username = user.username;

			res.redirect('/user/feed');
		} else {
			res.send(err);
		}
	});
});

module.exports = router;
