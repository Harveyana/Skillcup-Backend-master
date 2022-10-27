const firebase = require('firebase');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const fireconfig = {
    apiKey: "AIzaSyAebWXihdpH37PIfJOVWqvyi92mll9AFjk",
    authDomain: "skillcup-1a955.firebaseapp.com",
    projectId: "skillcup-1a955",
    storageBucket: "skillcup-1a955.appspot.com",
    messagingSenderId: "763413896151",
    appId: "1:763413896151:web:0e863d69cb564cc0f20992",
    measurementId: "G-CF42PHPK10"
};
firebase.initializeApp(fireconfig);
const Auth = firebase.auth()
module.exports = Auth;