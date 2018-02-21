var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var arxiv = require('../lib/get-papers.js');

router.get('/feed', function(req, res, next) {
	if (req.session.isAuthenticated) {
		// Get user info
		User.findOne({'username': req.session.username}, function(err, user) {
			// Get first feed papers
			var initialFeed = user.subjects[0];
			arxiv.getSubjectsPapers(initialFeed, 0, req.query, function(err, papers) {
				if (!initialFeed) {
					// No feeds added
					err = {message: 'You have not subscribed to any feeds.'};
					papers = null;
				}

				res.render('user/feed', {
					isAuthenticated: req.session.isAuthenticated,
					user: user,
					papers: papers,
					initialFeed: user.subjects[0],
					error: err,
				});
			});
		});
	} else {
		// Not logged in
		res.redirect('/login');
	}
});

router.get('/library', function(req, res, next) {
  if (req.session.isAuthenticated) {
		// Get user info
		User.findOne({'username': req.session.username}, function(err, user) {
			arxiv.getPapersFromList(user.library, function(err, papers) {
				res.render('user/library', {
					isAuthenticated: req.session.isAuthenticated,
					user: user,
					papers: papers,
					error: err,
				});
			});
		});
	} else {
		// Not logged in
		res.redirect('/login');
	}
});

router.get('/settings', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
