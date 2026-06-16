import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDH9K3jkSSEOcKVyBiBDBquX7a8W6ljHuc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agrifincart.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agrifincart",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agrifincart.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "377250343115",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:377250343115:web:3dac40ff8d78f94a03d34e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WC4GVQMY66",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
