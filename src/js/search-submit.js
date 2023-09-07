import {qnaInput} from "./firebase.js";

var text = "";

document.getElementById("search-form").addEventListener("submit", function (event) {
	event.preventDefault(); // Prevent form from submitting

	// check if input is empty
	var input = document.getElementById("search-input"); // Get search input
	var searchTerm = input.value; // Get search term
	searchTerm = searchTerm.trim();

	if (searchTerm.length == 0) { // if input is empty string 
		return; 
	}
	
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
				document.getElementById("introduction").classList.add("d-none");
				var input = document.getElementById("search-input"); // Get search input
				var searchTerm = input.value; // Get search term
				searchTerm = searchTerm.trim()
				// question mark not added in case the query is more than a simple question
				// if (!searchTerm.endsWith("?")) {
				// 	searchTerm += "?";
				// } 
				if (searchTerm) { // If search term is not empty
					// get userkey for admin supervision
					// UNCOMMENT THE LINE BELOW ONCE BETA (FREE) RELEASE IS OVER
// 					var userkey = document.getElementById("passcode").innerHTML;
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
						body: JSON.stringify({ question: text + searchTerm, search: searchTerm, past: text }),
						// COMMENT THE LINE ABOVE AND UNCOMMENT THE LINE BELOW ONCE BETA (FREE) RELEASE IS OVER
// 						body: JSON.stringify({ question: text + searchTerm, search: searchTerm, password: userkey }),
					})
					.then((response) => response.text())
					.then(async (data) => {
// 						UNCOMMENT THE LINE BELOW ONCE BETA (FREE) RELEASE IS OVER
// 						const firebaseConfig = JSON.parse(data)[1];
						data = JSON.parse(data)[0];
						data = data.replace(/^"(.+)"$/, '$1');
						data = data.replace(/\\"/g, '"');
// 						console.log(data);
						// data = data.replace(/\n/g, '<br>');
						// list of possible errors
						let error_char = ['', 'A', 'A:'];
						let error_sentence = ['This question is inappropriate for GPTionary. GPTionary is a dictionary service that helps users find words or phrases based on the description given.',
								     'This question is considered to be harmful and is inappropriate for GPTionary.',
								     'Your question is taking too long to answer. Please rephrase and/or try again.',
								     'This is not a question, so GPTionary cannot provide an answer.',
								     'An error has occured while processing your question. Try a different question or reload the page.'];
						data = data.trim()
						if (error_char.includes(data)) {
							data = "Sorry, there was an error processing your request. Please rephrase your question or refresh the page.";
						} else {
							// remove 'A:' in beginning
							if (data.startsWith('A:')) {
								data = data.slice(2);
								data = data.trim();
							}
							// remove quotations (except phrases that are in quotes)
							data = data.trim();
							if (data.endsWith('"')) {
							    data = data.slice(0,-1);
							}
							if (!error_sentence.includes(data)) {
								text = text + "Q: " + searchTerm + " A: " + JSON.stringify(data) + " ";
							}
						}
						// update the innerHTML of the list item to include the answer
						listItemA.innerHTML = listItemA.innerHTML.replace('<span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span>', data);
						// save in firebase regardless of the answer
// 						UNCOMMENT THE LINE BELOW ONCE BETA (FREE) RELEASE IS OVER
// 						await qnaInput(userkey, searchTerm, data, firebaseConfig);
						submitButton.removeAttribute("disabled");
					})
					.catch(error => {
						console.error(error);
						data = "Sorry, there was a server error processing your request. Please rephrase your question or refresh the page.";
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
