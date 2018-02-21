var parseString = require('xml2js').parseString;
var request = require('request');
var isTopicCode = require('../lib/topic-names.js').isTopicCode;

module.exports = {
	
	getPapers: function (url, callback) {
		request(url, function (err, res, body) {
				if (!err && res.statusCode == 200) {
					// Convert XML to json
					parseString(body, function (err, result) {
						if (result.feed.entry == null) {
							// Could not parse data
							process.nextTick(function() {
								callback({message: 'Could not parse arxiv API'}, null);
							});
						
						} else {
							var papersArray = result.feed.entry;
							var formattedData = []; // Stores all papers

							for (var j = 0; j < papersArray.length; j++){
								var obj = {};

								obj.link = papersArray[j].id[0];

								var splitLink = obj.link.split('/');
								obj.id = splitLink[4];

								obj.pdfLink = 'http://arxiv.org/pdf/'+ obj.id +'.pdf'; 
								
								var updatedUnixDate = new Date(papersArray[j].updated[0]);
								obj.updatedDate = updatedUnixDate.getFullYear() + '/' + (updatedUnixDate.getMonth() + 1) + '/' + updatedUnixDate.getDate();
								
								var publishedUnixDate = new Date(papersArray[j].published[0]);
								obj.publishedDate = publishedUnixDate.getFullYear() + '/' + (publishedUnixDate.getMonth() + 1) + '/' + publishedUnixDate.getDate();
								
								obj.title = papersArray[j].title[0];
								obj.abstract = papersArray[j].summary[0];

								var authors = [];
								for (var i = 0; i < papersArray[j].author.length; i++) {
									authors.push(papersArray[j].author[i].name[0]);
								}
								obj.authors = authors;
									
								subjects = [];
								for (var i = 0; i < papersArray[j].category.length; i++) {
									//Eliminate unsupported categories
									if (isTopicCode(papersArray[j].category[i].$.term)) {
										subjects.push(papersArray[j].category[i].$.term);
									}
								}
								obj.subjects = subjects;

								formattedData.push(obj);
							}

							process.nextTick(function() {
							callback(err, formattedData);
						});
						}
						
				});

				} else {
					process.nextTick(function () {
					callback(err, null);
				});
				}
		});
	},

	search: function(query, queryParams, callback) {
		var sortBy = queryParams.sortBy || 'relevance';
		var sortOrder = queryParams.sortOrder;
		var maxResults = queryParams.maxResults;
		var pageNum = queryParams.pageNum;

		var url = this.makeSearchQueryUrl(query, sortBy, sortOrder, maxResults, pageNum);
		console.log(query);
		console.log(url);
		this.getPapers(url, function(err, papers) {
			process.nextTick(function () {
				callback(err, papers);
			});
		});
	},

	getPaper: function(paperId, callback) {
		var url = this.makeIdListUrl(paperId);

		this.getPapers(url, function(err, papers) {
			if (papers) {
				process.nextTick(function () {
					callback(err, papers[0]);
				});
			} else {
				process.nextTick(function () {
					callback({message: 'No paper was found'}, null);
				});
			}
		});
	},

	getPapersFromList: function(list, callback) {
		var url = this.makeIdListUrl(list);

		this.getPapers(url, function(err, papers) {
			process.nextTick(function () {
				callback(err, papers);
			});
		});
	},

	getSubjectsPapers: function(subjectId, pageNum, queryParams, callback) {
		var sortBy = queryParams.sortBy;
		var sortOrder = queryParams.sortOrder;
		var maxResults = queryParams.maxResults;

		var prefix = subjectId;
		var url = this.makeSearchQueryUrl(prefix, sortBy, sortOrder, maxResults, pageNum);

		this.getPapers(url, function(err, papers) {
			process.nextTick(function () {
				callback(err, papers);
			});
		});

	},

	makeSearchQueryUrl: function(prefix, sortBy, sortOrder, maxResults, pageNum) {
		//Ex. http://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=30
		//Set defaults
		prefix = prefix || 'all';
		sortBy = sortBy || 'submittedDate';
		sortOrder = sortOrder || 'descending';
		maxResults = maxResults || '45'; // Increase default here to increase pagination
		start = (pageNum * maxResults) || '0'; // Zero indexed

		var url = 'http://export.arxiv.org/api/query?search_query=';
			url += prefix + '&';
			url += 'sortBy=' + sortBy + '&';
			url += 'sortOrder=' + sortOrder + '&';
			url += 'max_results=' + maxResults + '&';
			url += 'start=' + start;

		return url;
	},

	makeIdListUrl: function(list) {
		//Ex. http://export.arxiv.org/api/query?id_list=1609.00464v1,1608.08809v1,1609.00465v1

		var baseUrl = 'http://export.arxiv.org/api/query?id_list=';
			baseUrl += list;

		return baseUrl;
	},
};