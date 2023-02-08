// Get the input field
var input = document.getElementById("userkey");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
	// If the user presses the "Enter" key on the keyboard
	if (event.key === "Enter") {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		document.getElementById("submitbutton").click();
	}
});

let correct = false;
$("#submitbutton").mousedown(function () {
	$(this).addClass("pressed");
});
$("#submitbutton").mouseup(function () {
	$(this).removeClass("pressed");
});
$("#submitbutton").mouseout(function () {
	$(this).removeClass("pressed");
});
function checkkey() {
	// remove class so that textbox can shake
	$('#userkey').removeClass('animated shake');

	var userkey = document.getElementById("userkey").value;
	// console.log(userkey);
	fetch("https://gptionary-password.vercel.app/", {
		headers: { "Content-Type": 'application/json' },
		method: "POST",
		body: JSON.stringify({ key: userkey }),
	})
		.then((response) => response.text())
		.then((data) => {
			var checkkeyresult = data.replace(/^"(.*)"$/, '$1');
			// console.log(checkkeyresult);
			if (checkkeyresult == 'true') {
				const verifysubmitButton = document.getElementById("submitbutton");
				verifysubmitButton.setAttribute("disabled", "true");

				// cookie to keep user logged in
				function setCookie(cname, cvalue, exminutes) {
					var d = new Date();
					d.setTime(d.getTime() + (exminutes * 60 * 1000));
					var expires = "expires=" + d.toUTCString();
					document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
				};
				// an hour of access
				setCookie("password", userkey, 1);
				document.getElementById("passcode").innerHTML = userkey;

				// 'correct' variable is changed to allow Q&A
				correct = true;

				const delay = ms => new Promise(res => setTimeout(res, ms));
				const timedelay = async () => {
					document.getElementById("userkey").classList.remove("preuserkey");
					document.getElementById("userkey").style.border = "1px solid #4ed38e";
					document.getElementById("userkey").classList.remove("userkeybad");
					document.getElementById("userkey").classList.add("userkey");
					document.getElementById("userkey").value = "";
					$('#userkey').attr("placeholder", "Authentication successful.");
					await delay(1500);
					$('#keyquery').modal('hide');
					document.getElementById("userkey").classList.remove("userkey");
					document.getElementById("userkey").style.border = null;
					document.getElementById("userkey").classList.add("preuserkey");
					verifysubmitButton.removeAttribute("disabled");
				};
				timedelay();
			} else {
				correct = false;
				document.getElementById("userkey").classList.remove("preuserkey");
				document.getElementById("userkey").style.borderColor = "red";
				document.getElementById("userkey").classList.remove("userkey");
				document.getElementById("userkey").classList.add("userkeybad");
				document.getElementById("userkey").value = "";
				$('#userkey').addClass('animated shake');
				$('#userkey').attr("placeholder", "Incorrect key. Please try again.");
			}
		})
		.catch(error => console.error(error));
}


