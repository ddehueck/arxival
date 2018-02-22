var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var arxiv = require('../lib/get-papers.js');

router.get('/', function(req, res, next) {
	var query = req.query.q;

	arxiv.search(query, req.query, function(err, papers) {
		console.log(err);
		res.render('search', {
			title: 'Arxival - Search',
			isAuthenticated: req.session.isAuthenticated,
			query: query,
			papers: papers,
			error: err,
		});
	});
	
});


module.exports = router;
