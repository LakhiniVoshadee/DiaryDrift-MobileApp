import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsun-S9s-ACYrwLgU9awIJ77zN7yw9UX8",
  authDomain: "diarydrift-mobileapp-a970f.firebaseapp.com",
  projectId: "diarydrift-mobileapp-a970f",
  storageBucket: "diarydrift-mobileapp-a970f.firebasestorage.app",
  messagingSenderId: "884981629170",
  appId: "1:884981629170:web:797c69b51e924b78a5506b",
  measurementId: "G-2HQ3KMMD1W"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
