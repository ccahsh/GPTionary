const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/', async function (req, res) {

	let user_input = req.body.key;
	let list = [
		'example1',
		'example2',
		'example3',
		'example4',
		'example5',
		'wonderfulnight',
		'onetwothreefourfivesixseven'
	];
	if (list.includes(user_input)) {
		res.json('true');
		// console.log('true');
	} else {
		res.json('false');
		// console.log('false');
	}

});

app.listen(6060);
