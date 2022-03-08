// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyCpr3eDyk7yg6JmOnpNR8CEt5wOmTsNU2Y",
  authDomain: "shreeetof.firebaseapp.com",
  databaseURL: "https://shreeetof-default-rtdb.firebaseio.com",
  projectId: "shreeetof",
  storageBucket: "shreeetof.appspot.com",
  messagingSenderId: "410252514308",
  appId: "1:410252514308:web:917f22e7ad2af870ed9151",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
