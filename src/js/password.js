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
		'MotherhoodPatientActressSour5',
		'DropMainInventionNature3',
		'MinisterShapeWorseGate3',
		'FlavorSpinSuspectLaugh5',
		'HostHarvestAdmitWonder2',
		'WitnessTogetherCriminalUgly1'
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
