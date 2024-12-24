// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLViRvNntyc3XDtWMjIJgC2FiVTZ1rCLk",
  authDomain: "quiz-app-65890.firebaseapp.com",
  projectId: "quiz-app-65890",
  storageBucket: "quiz-app-65890.firebasestorage.app",
  messagingSenderId: "160825397569",
  appId: "1:160825397569:web:d952e65d8986e86d66d1c0",
  measurementId: "G-3179NNKS0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);