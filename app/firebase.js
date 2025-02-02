


// Import the functions you need from the SDKs you need
// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIFt9sa-dnaq0aaiTf3waA9mQR394MaJg",
  authDomain: "healthcare-ai-a0895.firebaseapp.com",
  projectId: "healthcare-ai-a0895",
  storageBucket: "healthcare-ai-a0895.firebasestorage.app",
  messagingSenderId: "833307583524",
  appId: "1:833307583524:web:aa00b5938653d987b824b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, db, provider, signInWithPopup };

