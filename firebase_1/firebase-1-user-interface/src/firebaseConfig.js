// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHzUs0SGiBy7CEP9JcC8goRPyQqpIQKbw",
  authDomain: "dae-schoology.firebaseapp.com",
  projectId: "dae-schoology",
  storageBucket: "dae-schoology.firebasestorage.app",
  messagingSenderId: "34513080553",
  appId: "1:34513080553:web:2c6270a525886b836e6078",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
