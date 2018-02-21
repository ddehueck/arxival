var express = require('express');
var router = express.Router();

var arxiv = require('../lib/get-papers.js');
var User = require('../models/user.js');
var topicNames = require('../lib/topic-names.js');

router.get('/:id', function(req, res, next) {
	///:id?prefix=cs.AI&sortBy=submittedDate&sortOrder=descending&maxResults=25&start=0
	var subjectId = req.params.id;
	var pageNum = req.query.page;
	
	arxiv.getSubjectsPapers(subjectId, pageNum, req.query, function(err, papers) {
		if (req.session.isAuthenticated) {
			// Check if user has subject in it's feed
			User.findOne({username: req.session.username}, function(err, user) {
				var isInFeed = user.subjects.includes(subjectId);
					
				res.render('subject', {
					isAuthenticated: req.session.isAuthenticated,
					papers: papers,
					subjectId: subjectId,
					subjectName: topicNames.getTopicName(subjectId),
					isInFeed: isInFeed,
					pageNum: pageNum,
					error: err,
				});
			});
		} else {
			res.render('subject', {
				isAuthenticated: req.session.isAuthenticated,
				papers: papers,
				subjectId: subjectId,
				subjectName: topicNames.getTopicName(subjectId),
				isInFeed: false,
				pageNum: pageNum,
				error: err,
			});
		}
	});
});

router.post('/:id/save', function(req, res, next) {
	var subjectId = req.params.id;

	if (req.session.isAuthenticated) {
		User.findOne({username: req.session.username}, function(err, user) {
			if (user.subjects.includes(subjectId)) {
				res.status(200).send('Already saved subject to feed.');
			} else {
				// Prepend to subjects
				user.subjects.unshift(subjectId);
				// Save change
				user.save(function (err){
					if (err) handleError();
					res.status(200).send('Added subject to feed.');
				});
			}
		});
	} else {
		res.status(403).send('Must be logged in to save a subject feed');
	}
});

router.post('/:id/remove', function(req, res, next) {
	var subjectId = req.params.id;

	if (req.session.isAuthenticated) {
		User.findOne({username: req.session.username}, function(err, user) {
			if (user.subjects.includes(subjectId)) {
				// Remove to subjects
				user.subjects.pull(subjectId);
				// Save change
				user.save(function (err){
					if (err) handleError();
					res.status(200).send('Removed subject from feed.');
				});
			} else {
				res.status(200).send('Subject not saved to feed.');
			}
		});
	} else {
		res.status(403).send('Must be logged in to remove a subject feed');
	}
});

router.get('/:id/html', function(req, res, next) {
	var subjectId = req.params.id;
	var pageNum = req.query.pageNum - 1; // 0 indexed

	arxiv.getSubjectsPapers(subjectId, pageNum, req.query, function(err, papers) {
		res.render('components/feed', {
			papers: papers,
			error: err 
		});
	});
});

module.exports = router;
