var asideNavClick = document.getElementById('mobile-nav-click');
var aside = document.getElementsByTagName('aside')[0];
var exitBtn = document.getElementById('mobile-exit');

document.onclick = function(e) {
	if (window.matchMedia("(max-width: 1040px)").matches) {
		// We're in mobile layout
		if (asideNavClick == e.target) {
			if (!aside.classList.contains('mobile-viewable-nav')) {
				// Clicked on nav
				aside.classList.toggle('mobile-viewable-nav');
			}

		} else if (exitBtn.contains(e.target)) {
			aside.classList.toggle('mobile-viewable-nav');
		}
	}
};