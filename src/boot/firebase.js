import * as firebase from "firebase/app"
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyCxDJP-3r2maqhvxeuuyK0YzeLbp503dB8",
    authDomain: "prueba-tecnica-3519b.firebaseapp.com",
    databaseURL: "https://prueba-tecnica-3519b.firebaseio.com",
    projectId: "prueba-tecnica-3519b",
    storageBucket: "prueba-tecnica-3519b.appspot.com",
    messagingSenderId: "1084931546698",
    appId: "1:1084931546698:web:6340f061cb9d69aee550b3"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export {db, firebase}; 

