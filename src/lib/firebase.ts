import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDH9K3jkSSEOcKVyBiBDBquX7a8W6ljHuc",
  authDomain: "agrifincart.firebaseapp.com",
  projectId: "agrifincart",
  storageBucket: "agrifincart.firebasestorage.app",
  messagingSenderId: "377250343115",
  appId: "1:377250343115:web:3dac40ff8d78f94a03d34e",
  measurementId: "G-WC4GVQMY66",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
