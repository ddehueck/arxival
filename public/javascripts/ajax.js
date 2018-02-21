function postRequest(url, data, callback) {
	var request = new XMLHttpRequest();
	request.open('POST', url, true);

	request.onload = function() {
		callback(request);
	};

	request.onerror = function() {
		alert('Something went wrong.');
	};

	request.send(data);
}

function getRequest(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
		callback(request);
	};

	request.onerror = function() {
		alert('Something went wrong.');
	};

	request.send();
}