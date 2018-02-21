var asideNav = document.getElementsByTagName('aside')[0];
var exitBtn = document.getElementById('mobile-exit');

document.onclick = function(e) {
	if (window.matchMedia("(max-width: 1040px)").matches) {
		// We're in mobile layout
		if (asideNav == e.target) {
			if (!asideNav.classList.contains('mobile-viewable-nav')) {
				// Clicked on nav
				asideNav.classList.toggle('mobile-viewable-nav');
			}

		} else if (exitBtn.contains(e.target)) {
			asideNav.classList.toggle('mobile-viewable-nav');
		}
	}
};