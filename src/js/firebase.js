// import dotenv from "dotenv";
// dotenv.config({path:__dirname+'/./../env/.env'});
// this doesn't work

// require("dotenv").config({path:__dirname+'/./../env/.env'});

// var firebase = require("firebase/app");
// require("firebase/database");
// import template from "./firebasepwd.js";
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// import { getAuth, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// console.log(template);

// const template = {
// 	apiKey: process.env.APIKEY,
// 	authDomain: process.env.AUTHDOMAIN,
// 	databaseURL: process.env.DATABASEURL,
// 	projectId: process.env.PROJECTID,
// 	storageBucket: process.env.STORAGEBUCKET,
// 	messagingSenderId: process.env.MESSAGINGSENDERID,
// 	appId: process.env.APPID,
// 	measurementId: process.env.MEASUREMENTID
// };

// const fbapp = initializeApp(firebaseConfig);
// const db = getDatabase();

export async function qnaInput(ukey, question, answer, firebaseConfig) {
	const createFirebaseApp = (config = {}) => {
  		try {
    			return getApp();
  		} catch () {
    			return initializeApp(config);
  		}
	};
	const fbapp = createFirebaseApp(firebaseConfig);
	// const fbapp = initializeApp(firebaseConfig);
	const db = getDatabase();
	const date = new Date().toISOString();
	function getSubstringUntilDot(str) {
		var dotIndex = str.indexOf(".");
		return str.substring(0, dotIndex);
	}
	let fbdate = getSubstringUntilDot(date);
	// console.log(fbdate);
	const pushRef = await ref(db, ukey + "/" + fbdate);
	// for 'question' to be updated in Firebase: Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"
	question = question.split('.').join('-');
	question = question.split('#').join('-');
	question = question.split('$').join('-');
	question = question.split('/').join('-');
	question = question.split('[').join('-');
	question = question.split(']').join('-');
	update(pushRef, { [question]: answer });
}
