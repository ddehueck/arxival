function addPaper(url, actionButton) {
	postRequest(url, null, function (request) {
		alert(request.response);

		if (request.status == 200) {
			actionButton.innerText = "Remove Paper From Library";
			// Update button
			actionButton.classList.remove("save-paper");
			actionButton.classList.add("remove-paper");
		}
	});
}

function removePaper(url, actionButton) {
	postRequest(url, null, function (request) {
		alert(request.response);

		if (request.status == 200) {
			actionButton.innerText = "Save Paper To Library";
			// Update button
			actionButton.classList.remove("remove-paper");
			actionButton.classList.add("save-paper");
		}
	});
}