import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
//import { getAuth, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
	apiKey: "AIzaSyCw5FE_svyLH7_bGiansYPn2bikyisq3Xg",
	authDomain: "rev-dict-22.firebaseapp.com",
	databaseURL: "https://rev-dict-22-default-rtdb.firebaseio.com",
	projectId: "rev-dict-22",
	storageBucket: "rev-dict-22.appspot.com",
	messagingSenderId: "546641117639",
	appId: "1:546641117639:web:20ea3eea4605bdc440d9e2",
	measurementId: "G-QKMVPXQLP3"
};

const fbapp = initializeApp(firebaseConfig);
const db = getDatabase();

export async function qnaInput(ukey, question, answer) {
	const date = new Date().toISOString();
	function getSubstringUntilDot(str) {
		var dotIndex = str.indexOf(".");
		return str.substring(0, dotIndex);
	}
	let fbdate = getSubstringUntilDot(date);
	const pushRef = await ref(db, ukey + "/" + fbdate);
	update(pushRef, { [question]: answer });
}


// export async function qnaInput(ukey, question, answer) {
// 	const date = new Date().toISOString();
// 	const pushRef = await ref(db, ukey + "/" + date +"/");
// 	update(pushRef, { [question]: answer });
// }