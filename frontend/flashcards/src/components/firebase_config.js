// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ67mHYGIXZPwUXAHv9ieOL3zjYyD4E8k",
  authDomain: "cruzcards-sc.firebaseapp.com",
  projectId: "cruzcards-sc",
  storageBucket: "cruzcards-sc.appspot.com",
  messagingSenderId: "857186658410",
  appId: "1:857186658410:web:8794c25a05eb0e8d1d8213",
  measurementId: "G-S0YS8ZWVF2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
// const analytics = getAnalytics(app);
