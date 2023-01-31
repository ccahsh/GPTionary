require("dotenv").config({path:__dirname+'/./../env/.env'});

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/', async function (req, res) {

	let user_input = req.body.key;

	// first one is for admin purpose only
	// generate the rest from https://www.worksighted.com/random-passphrase-generator/. remove the single space from "Separator". do not change the rest (min words = 4, min length = 20, Make First Letter Uppercase, Append a Random Number to the End (0 - 9)).
	// the reason for above is to standardize the passphrase generation process AND to make sure FireBase is updated w/o error.
	var list = JSON.parse(process.env.PASSWORD);

	if (list.includes(user_input)) {
		res.json('true');
		// console.log('true');
	} else {
		res.json('false');
		// console.log('false');
	}

});

app.listen(5500);
