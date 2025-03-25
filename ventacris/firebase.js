import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAHi1l6ZTa5247mUy250Oz-w2acprNdPfU",
    authDomain: "crisvent-6fb46.firebaseapp.com",
    projectId: "crisvent-6fb46",
    storageBucket: "crisvent-6fb46.firebasestorage.app",
    messagingSenderId: "28332018385",
    appId: "1:28332018385:web:6d77990c35558ff17d93f0",
    measurementId: "G-VRQNJ6584P"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
