// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, DocumentReference } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDH9K3jkSSEOcKVyBiBDBquX7a8W6ljHuc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agrifincart.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agrifincart",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agrifincart.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "377250343115",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:377250343115:web:3dac40ff8d78f94a03d34e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WC4GVQMY66",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);

export let analytics: Analytics | null = null;
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

/**
 * Clean up objects before saving to Firestore to prevent "Unsupported field value: undefined" errors.
 * Replaces/removes undefined properties recursively for plain arrays and objects.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj as any;
  if (Array.isArray(obj)) {
    return obj.map(cleanFirestoreData) as any;
  }
  if (typeof obj === "object") {
    const proto = Object.getPrototypeOf(obj);
    if (proto === null || proto === Object.prototype) {
      const copy: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const val = (obj as any)[key];
          if (val !== undefined) {
            copy[key] = cleanFirestoreData(val);
          }
        }
      }
      return copy;
    }
  }
  return obj;
}

/**
 * A safe setDoc wrapper that automatically strips out undefined values from the data object.
 */
export function safeSetDoc<T>(
  docRef: DocumentReference<T>,
  data: T,
  options?: any
) {
  const cleaned = cleanFirestoreData(data);
  return options ? setDoc(docRef, cleaned, options) : setDoc(docRef, cleaned);
}
