var express = require('express');
var router = express.Router();

var arxiv = require('../lib/get-papers.js');
var User = require('../models/user.js');

function handleError(err) {
	console.log(err);
}

router.get('/:id', function(req, res, next) {
	var paperId = req.params.id;
	
	arxiv.getPaper(paperId, function(err, paper) {
		if (!err) {
			// Check if paper is already saved
			if (req.session.isAuthenticated) {
				User.findOne({username: req.session.username}, function (err, user) {
					var isInLibrary = user.library.includes(paperId);
					
					res.render('paper', {
						isAuthenticated: req.session.isAuthenticated,
						paper: paper,
						isInLibrary: isInLibrary,
					});
				});
			} else {
				res.render('paper', {
					isAuthenticated: req.session.isAuthenticated,
					paper: paper,
					isInLibrary: false,
				});
			}

		} else {
			res.send('There was an error');
		}
	});
});

router.post('/:id/save', function(req, res, next) {
	var paperId = req.params.id;

	if (req.session.isAuthenticated) {
		User.findOne({username: req.session.username}, function(err, user) {
			if (err) handleError(err);

			if (user.library.includes(paperId)) {
				res.status(200).send('Already saved paper to feed.');
			} else {
				user.library.unshift(paperId);
				// Save change
				user.save(function (err){
					if (err) handleError(err);

					res.status(200).send('Saved paper to library.');
				});
			}
		});
	} else {
		res.status(403).send('Must be logged in to save a paper.');
	}
});

router.post('/:id/remove', function(req, res, next) {
	var paperId = req.params.id;

	if (req.session.isAuthenticated) {
		User.findOne({username: req.session.username}, function(err, user) {
			if (err) handleError(err);

			if (user.library.includes(paperId)) {
				// Remove paper from library
				user.library.pull(paperId);
				// Save change
				user.save(function (err){
					if (err) handleError(err);

					res.status(200).send('Removed paper from library.');
				});
			} else {
				res.status(200).send('Paper not in library.');
			}
		});
	} else {
		res.status(403).send('Must be logged in to remove a paper.');
	}

});

module.exports = router;
