import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// This is client side firebase sdk

const firebaseConfig = {
    apiKey: "AIzaSyD1SX4oup7LywLZ1Ibeul1kQ6xMhlimum4",
    authDomain: "agentsfirebase.firebaseapp.com",
    projectId: "agentsfirebase",
    storageBucket: "agentsfirebase.appspot.com",
    messagingSenderId: "991688537119",
    appId: "1:991688537119:web:f80fd5976704a86057112a",
    measurementId: "G-WQCPL2GEFX"
};
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();