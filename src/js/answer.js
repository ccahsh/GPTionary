const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async function (req, res) {

	try {
		// will make the filler switched to structured list of questions answered by chatgpt (probably)
		var filler = "You will be finding words or phrases that best represent the user's question. Questions will be given after 'Q:'. Give your answer directly; do not start your answer with 'A:'. You will also provide definition(s) of the answer, some trivia, and three example sentences for the answer you gave. If the user gives a follow-up question, answer it, too, as long as it is appropriate for dictionary use. If the answer is not a word or phrase, explain that the question is not appropriate for dictionary use. If the question needs more detail to answer, explain that the question needs more information to answer. If the question is repeated before, explain that the question is redundant. Q: "

		const prequery = async (data) => {

			// get toxicity list
			const response = await fetch(
				"https://api-inference.huggingface.co/models/unitary/toxic-bert",
				{
					headers: { Authorization: "Bearer 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" },
					method: "POST",
					body: JSON.stringify(data.now),
				}
			);

			const result = await response.json();

			// console.log(result);

			// compare
			var profanity_value = 0;
			// console.log(result);
			const list = result[0];
			// min threshold values for mild/serious profanity (manually decided)
			var low_threshold = 0.099;
			var high_threshold = 0.499;
			for (let i = 0; i < list.length; i++) {
				if (list[i].score > high_threshold) {
					profanity_value = 2
					break
				} else if (list[i].score > low_threshold) {
					profanity_value = 1
				}
			}

			input = filler + question_full + " A: ";
			// console.log(input);

			var output = "";
			// check profanity level & pass/not pass
			if (profanity_value != 0) {
				output = "The question you asked is considered to be profane; please rewrite or rephrase.";
			} else {
				// // using GPT3 model for checking validity of dictionary-based question

				// preinput = data.now + " Is the question finding for words, phrases, or definitions?"

				const configuration = new Configuration({
					apiKey: process.env.OPENAI_API_KEY,
				});
				const openai = new OpenAIApi(configuration);
				// source of error may be: exceeded quota, credit card should be renewed, or just a bug
				// const openai_preoutput = await openai.createCompletion({
				// 	model: "text-davinci-003",
				// 	prompt: preinput,
				// 	temperature: 0.5,
				// 	max_tokens: 500,
				// 	top_p: 0.5,
				// 	frequency_penalty: 0.5,
				// 	presence_penalty: 0.2,
				// });
				// var preoutput = openai_preoutput.data.choices[0].text;
				// preoutput = preoutput.trim();
				// preoutput = preoutput.toLowerCase();

				// console.log(preinput);
				// console.log(preoutput);

				var preoutput = 'yes';
				// preprompt conditioning is better

				if (preoutput.includes('yes')) {

					try {
						const openai_output = await openai.createCompletion({
							model: "text-davinci-003",
							prompt: input,
							temperature: 0.5,
							max_tokens: 500,
							top_p: 0.5,
							frequency_penalty: 0.5,
							presence_penalty: 0.2,
						});
						output = openai_output.data.choices[0].text;
						output = output.trim();
						// console.log(output);
					} catch (error) {
						console.log("GPT3 not working: " + error.message);
						// use BLOOM (not optimal, but better than nothing)
						BLOOM_input = { "inputs": input };
						const BLOOM_response = await fetch(
							"https://api-inference.huggingface.co/models/bigscience/bloom",
							{
								headers: { Authorization: "Bearer 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" },
								method: "POST",
								body: JSON.stringify(BLOOM_input),
							}
						);
						const BLOOM_result = await BLOOM_response.json();
						BLOOM_answer = BLOOM_result[0].generated_text;
						// console.log(BLOOM_answer);
						BLOOM_answer = BLOOM_answer.replace(input, "");
						BLOOM_output = BLOOM_answer.substring(0, BLOOM_answer.indexOf("Q:")).trim();
						output = BLOOM_output;
					}
					// chatgpt API blocked by recaptcha: https://github.com/transitive-bullshit/chatgpt-api 
					// const { ChatGPTAPIBrowser } = await import('chatgpt');

					// const api = new ChatGPTAPIBrowser({
					// 	email: 'trooperwalker11@gmail.com',
					// 	password: 'r3vd1ct!'
					// })

					// await api.initSession()

					// const result = await api.sendMessage(data)
					// output = result.response

				} else {
					output = "Please rephrase the question correctly and try again."
				}
			}
			return output;
		};

		// some preprocessing
		function preprocess(rawval) {
			rawval = rawval.trim();
			function notendsWithAny(suffixes, string) {
				for (let suffix of suffixes) {
					if (string.endsWith(suffix))
						return false;
				}
				return true;
			}
			if (notendsWithAny([".", "!", "?"], rawval)) {
				rawval += "."
			}
			return rawval;
		}

		question_full = preprocess(req.body.question);
		question_now = preprocess(req.body.search);

		// set time limit
		async function getResponseWithTimeout(timeLimit) {
			// Create a promise that will resolve with an automatic response
			const timeoutPromise = new Promise((resolve) => {
				setTimeout(() => {
					resolve("Your question is taking too long to answer. Please rephrase and/or try again.");
				}, timeLimit);
			});

			// Use the await function to get a response
			const awaitedResponse = await prequery({ full: question_full, now: question_now });

			// Use Promise.race() to check which promise resolves first
			return Promise.race([timeoutPromise, awaitedResponse]);
		}

		// wait for 10 seconds
		const output = await getResponseWithTimeout(15000);
		res.json(output);
		// console.log(output);
	} catch (error) {
		res.json("An error has occured while processing your question. Try a different question or reload the website.")
	}
});

app.listen(5000);
