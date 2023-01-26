(function () {
	// add more examples
	var words = [
		"Find a noun for the organ of hearing and balance in humans.",
		"What is a figure of speech that compares one to another?",
		"¿Qué palabra se usa para describir una persona que es muy inteligente?",
		"Find a verb for the act of leaving a place or situation.",
		"What is the word used to describe a person who is very kind and generous?",
		"Can you give me a noun for the state of being calm and peaceful?",
		"What is the word used to describe a person who is always in a bad mood?",
		"What is the word for describing a feeling of great fear or apprehension?",
		"Can you give me a noun for the state of being in love?",
		"Find a verb for the act of talking excessively or incessantly.",
		"What is the word for describing a feeling of great pride or self-respect?",
		"What is the word for describing a feeling of great sadness or despair?",
		"Can you give me a noun for the state of being optimistic or hopeful?",
		"Find a verb for the act of procrastinating or delaying.",
		"Word for feeling overwhelmed.",
		"Noun for a state of being content.",
		"Term for a figure of speech that uses irony.",
		"Word for describing a person who is very reliable.",
		"Noun for a state of being energized.",
		"Term for a figure of speech that uses words to create a sense of imagery.",
		"What is the word for describing a feeling of great passion or intensity?",
		"What is the word for describing a feeling of great joy or happiness?",
		"Find a verb for the act of giving up or surrendering.",
		"What is the word used to describe a person who is very humble and modest?",
		"What is the word for describing a feeling of great anger or rage?",
		"Can you give me a noun for the state of being open-minded and accepting?",
		"Find a verb for the act of taking initiative or being proactive.",
		"What is the word for describing a feeling of great excitement?",
		"Can you give me a noun for the state of being focused?",
		"Find a verb for the act of avoiding.",
		"What is the word used to describe a person who is very generous?",
		"What is the word used to describe a person who is very persistent?",
		"Find an adjective for the quality of being able to think strategically.",
		"What is the word for describing a feeling of great disappointment?"
	];
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	};
	var pre = getRandomInt(words.length - 1);
	$('#words').html(words[pre]);
	setInterval(function () {
		$('#words').fadeOut(function () {
			var post = getRandomInt(words.length - 1);
			while (post == pre) {
				post = getRandomInt(words.length - 1);
			}
			$(this).html(words[post]).fadeIn("slow");
			pre = post;
		});
	}, 4000);
})();