// import dotenv from "dotenv";
// dotenv.config({path:__dirname+'/./../env/.env'});
// this doesn't work

// require("dotenv").config({path:__dirname+'/./../env/.env'});

// var firebase = require("firebase/app");
// require("firebase/database");
// import template from "./firebasepwd.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// import { getAuth, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// const firebaseConfig = {
// 	apiKey: "AIzaSyCw5FE_svyLH7_bGiansYPn2bikyisq3Xg",
// 	authDomain: "rev-dict-22.firebaseapp.com",
// 	databaseURL: "https://rev-dict-22-default-rtdb.firebaseio.com",
// 	projectId: "rev-dict-22",
// 	storageBucket: "rev-dict-22.appspot.com",
// 	messagingSenderId: "546641117639",
// 	appId: "1:546641117639:web:20ea3eea4605bdc440d9e2",
// 	measurementId: "G-QKMVPXQLP3"
// };

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

// const fbapp = initializeApp(firebaseConfig);
// const db = getDatabase();

export async function qnaInput(ukey, question, answer, firebaseConfig) {
	const fbapp = initializeApp(firebaseConfig);
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


// export async function qnaInput(ukey, question, answer) {
// 	const date = new Date().toISOString();
// 	const pushRef = await ref(db, ukey + "/" + date +"/");
// 	update(pushRef, { [question]: answer });
// }
