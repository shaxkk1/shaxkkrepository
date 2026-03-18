// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHzUs0SGiBy7CEP9JcC8goRPyQqpIQKbw",
  authDomain: "dae-schoology.firebaseapp.com",
  projectId: "dae-schoology",
  storageBucket: "dae-schoology.firebasestorage.app",
  messagingSenderId: "34513080553",
  appId: "1:34513080553:web:8ebc725967c2c8986e6078",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
