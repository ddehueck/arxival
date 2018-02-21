function subscribe(url, actionButton, subjectId) {
	postRequest(url, null, function (request) {
		alert(request.response);

		if (request.status == 200) {
			actionButton.innerText = "Unsubscribe from " + subjectId;
			// Update Button
			actionButton.classList.remove("subscribe");
			actionButton.classList.add("unsubscribe");
		}
	});
}

function unsubscribe(url, actionButton, subjectId) {
	postRequest(url, null, function (request) {
		alert(request.response);

		if (request.status == 200) {
			actionButton.innerText = "Subscribe to " + subjectId;
			// Update Button
			actionButton.classList.remove("unsubscribe");
			actionButton.classList.add("subscribe");
		}
	});
}