import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBktuv5IGc6ggyfrLSU4zpavLqmacui3aI",
  authDomain: "github-notes-d1872.firebaseapp.com",
  projectId: "github-notes-d1872",
  storageBucket: "github-notes-d1872.firebasestorage.app",
  messagingSenderId: "410641562141",
  appId: "1:410641562141:web:f74b9fe1a88edf811ea4f4",
  measurementId: "G-60H735MEFL",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
