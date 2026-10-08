// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyEXAMPLE00000000000000000000000000",
  authDomain: "taskflow-app-4f2a1.firebaseapp.com",
  projectId: "taskflow-app-4f2a1",
  storageBucket: "taskflow-app-4f2a1.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000example0000example",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
