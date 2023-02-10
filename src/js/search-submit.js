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
// 			console.log(correct);
// 			console.log(check);
			if (check == 'false') { // if cookie got expired (to prevent indefinite usage)
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
						// list of possible errors
						let error_char = ['', 'A', 'A:'];
						let error_sentence = ['The question you asked is considered to be profane; please rewrite or rephrase.',
								     'Please rephrase the question correctly and try again.',
								     'Your question is taking too long to answer. Please rephrase and/or try again.',
								     'This question is not appropriate for dictionary use.',
								     'An error has occured while processing your question. Try a different question or reload the page.'];
						let test_data = data.trim()
						if (error_char.includes(test_data)) {
							data = "Sorry, there was an error processing your request. Please rephrase your question or refresh the page.";
						} else {
							// remove 'A:' in beginning
							if (data.startsWith('A:')) {
								data = data.slice(2);
								data = data.trim();
							}
							// remove quotations
							data = data.trim();
							if (data.startsWith('"')) {
							    data = data.slice(1);
							}
							if (data.endsWith('"')) {
							    data = data.slice(0,-1);
							}
							if (!error_sentence.includes(test_data)) {
								text = text + "Q: " + searchTerm + " A: " + JSON.stringify(data) + " ";
							}
						}
						// update the innerHTML of the list item to include the answer
						listItemA.innerHTML = listItemA.innerHTML.replace('<span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span>', data);
						// save in firebase regardless of the answer
						await qnaInput(userkey, searchTerm, data, firebaseConfig);
						submitButton.removeAttribute("disabled");
					})
					.catch(error => {
						console.error(error);
						data = "Sorry, there was an error processing your request. Please rephrase your question or refresh the page.";
						listItemA.innerHTML = listItemA.innerHTML.replace('<span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span>', data);
						// cannot save in firebase since config data is not given
						// await qnaInput(userkey, searchTerm, data, firebaseConfig);
						submitButton.removeAttribute("disabled");
					});
				};
			}

		})
		.catch(error => console.error(error));
});
