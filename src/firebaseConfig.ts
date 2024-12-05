// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_URL || "",
    authDomain: "proyecto-firebase-304ac.firebaseapp.com",
    projectId: "proyecto-firebase-304ac",
    storageBucket: "proyecto-firebase-304ac.firebasestorage.app",
    messagingSenderId: "109036896885",
    appId: "1:109036896885:web:6ce537fd30c26d9122ee3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage
const storage = getStorage(app);

export { storage };