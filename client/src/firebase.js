// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "thought-flow-88673.firebaseapp.com",
  projectId: "thought-flow-88673",
  storageBucket: "thought-flow-88673.appspot.com",
  messagingSenderId: "574170053369",
  appId: "1:574170053369:web:1d9abdebb8b5460f8c8028"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);