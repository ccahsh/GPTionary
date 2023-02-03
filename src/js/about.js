document.addEventListener("DOMContentLoaded", function () {
	document.querySelector('.pop-in').classList.add('pop-in');
	document.querySelector('.slide-in').classList.add('slide-in');
});
function openIndex() {
	const currentUrl = window.location.href;
	const substringUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
	window.open(substringUrl, '_blank');
}
function openWaitlist() {
	window.open("http://eepurl.com/ijuN8b", '_blank');
}
function openNewsletter() {
	window.open("https://gptionary.substack.com/", '_blank');
}

$(document).ready(function () {
	$("html, body").animate({ scrollTop: $(".black-section").offset().top }, 1000);
	$(window).scroll(function () {
		var scrollPos = $(window).scrollTop();
		if (scrollPos >= $(".black-section").offset().top && scrollPos < $(".white-section").offset().top) {
			$("html, body").animate({ scrollTop: $(".black-section").offset().top }, 1000);
		} else if (scrollPos >= $(".white-section").offset().top && scrollPos < $(".grey-section").offset().top) {
			$("html, body").animate({ scrollTop: $(".white-section").offset().top }, 1000);
		} else if (scrollPos >= $(".grey-section").offset().top) {
			$("html, body").animate({ scrollTop: $(".grey-section").offset().top }, 1000);
		}
	});
});

function scrollToSection2() {
	document.getElementById("second-section").scrollIntoView({ behavior: 'smooth' });
}
