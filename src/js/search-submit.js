import {qnaInput} from "./firebase.js";

var text = "";

document.getElementById("search-form").addEventListener("submit", function (event) {
	event.preventDefault(); // Prevent form from submitting
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	};

	var password = getCookie("password");
	// console.log("password: " + password);
	var check = 'false';

	// double confirm the password (not necessary)
	fetch("https://gptionary-password.vercel.app/", {
		headers: { "Content-Type": 'application/json' },
		method: "POST",
		body: JSON.stringify({ key: password }),
	})
		.then((response) => response.text())
		.then((data) => {
			// console.log("data:" + data);
			check = data.replace(/^"(.*)"$/, '$1');

			if (correct == false || check == 'false') { // if the user's key query is wrong (or refreshed the page) OR cookie got expired (to prevent indefinite usage)
				$('#keyquery').modal('show');
			} else {
				var input = document.getElementById("search-input"); // Get search input
				var searchTerm = input.value; // Get search term
				searchTerm = searchTerm.trim()
				// question mark not added in case the query is more than a simple question
				// if (!searchTerm.endsWith("?")) {
				// 	searchTerm += "?";
				// } 
				if (searchTerm) { // If search term is not empty
					// get userkey for admin supervision
					var userkey = document.getElementById("passcode").innerHTML;
					// Create a single list item for both question and answer
					var listItem = document.createElement("li");
					listItem.classList.add("list-group-item");
					listItem.innerHTML = '<b>Q: </b>' + searchTerm;
					document.getElementById("search-history").append(listItem);
					input.value = ""; // Clear search input
					const submitButton = document.getElementById("button-addon2");
					submitButton.setAttribute("disabled", "true");
					var listItemA = document.createElement("li");
					listItemA.classList.add("list-group-item");
					document.getElementById("search-history").append(listItemA);
					listItemA.innerHTML += "<b>A: </b><span class='loader__dot'>.</span><span class='loader__dot'>.</span><span class='loader__dot'>.</span>";

					fetch("https://gptionary-answer.vercel.app/", {
						headers: { "Content-Type": 'application/json' },
						method: "POST",
						body: JSON.stringify({ question: text + searchTerm, search: searchTerm, password: userkey }),
					})
						.then((response) => response.text())
						.then(async (data) => {
							// console.log(data);
							const firebaseConfig = JSON.parse(data)[1];
							data = JSON.parse(data)[0];
							data = data.replace(/^"(.*)"$/, '$1');
							data = data.replace(/\n/g, '<br>');
							data = data.replace(/\\"/g, '"');
							// console.log(data);
							// data = data.replace(/\n/g, '<br>');
							// update the innerHTML of the list item to include the answer
							listItemA.innerHTML = listItemA.innerHTML.replace('<span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span>', data);
							text = text + "Q: " + searchTerm + " A: " + JSON.stringify(data) + " ";
							await qnaInput(userkey, searchTerm, data, firebaseConfig);
							submitButton.removeAttribute("disabled");
						})
						.catch(error => console.error(error));
				};
			}

		})
		.catch(error => console.error(error));
});
