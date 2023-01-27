const searchHistory = document.querySelector("#search-history");

// Function that scrolls to the bottom of the element
function scrollToBottom() {
	searchHistory.scrollTop = searchHistory.scrollHeight;
}

// Call the function on page load
window.onload = scrollToBottom;

// Call the function whenever new content is added to the element
searchHistory.addEventListener("DOMNodeInserted", scrollToBottom);