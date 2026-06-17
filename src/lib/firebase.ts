// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCQeuFABathAEhUsSb7hnrio-Ao8eR3zKA",
  authDomain: "sangronyx.firebaseapp.com",
  projectId: "sangronyx",
  storageBucket: "sangronyx.firebasestorage.app",
  messagingSenderId: "31802636734",
  appId: "1:31802636734:web:1cc79606a1934a9d60e1ef",
  measurementId: "G-G5EP37HL6P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics not supported:", err);
    });
}
