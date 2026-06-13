import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_qdWDQNqOwDroHVXXnsPyCWrt7T9H8x8",
  appId: "1:903829052403:web:922a43da877caf77821086",
  messagingSenderId: "903829052403",
  projectId: "orufms",
  authDomain: "orufms.firebaseapp.com",
  storageBucket: "orufms.firebasestorage.app",
  measurementId: "G-4VC16SK9G9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
