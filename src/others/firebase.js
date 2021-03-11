import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3UtfX87V83639f6Y8GEptoX0hgHmuS9o",
  authDomain: "football-dashboard-fa057.firebaseapp.com",
  databaseURL: "https://football-dashboard-fa057-default-rtdb.firebaseio.com",
  projectId: "football-dashboard-fa057",
  storageBucket: "football-dashboard-fa057.appspot.com",
  messagingSenderId: "671355332251",
  appId: "1:671355332251:web:211baa76fb297ebff8483e",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
