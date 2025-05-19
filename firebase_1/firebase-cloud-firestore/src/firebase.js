// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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
  appId: "1:34513080553:web:8ebc725967c2c8986e6078",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
