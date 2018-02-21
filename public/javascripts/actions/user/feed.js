var feedHtml = document.getElementById('feed');
var feedHeading = document.getElementById('feed-heading');

function switchSubject(subjectId, targetButton) {
	var url = '/subjects/' + subjectId + '/html';

	getRequest(url, function(request) {
		feedHtml.innerHTML = request.response;
	});
}

var subjectLinksDiv = document.getElementById('subjects');
subjectLinksDiv.addEventListener('click', function(e) {
	if (e.target.tagName == 'A'){
		var subjectId = e.target.text;
		
		feedHeading.innerHTML = 'Showing: ' + subjectId;
		feedHtml.innerHTML = '<p>Loading...</p>';
		switchSubject(subjectId);
	}
});