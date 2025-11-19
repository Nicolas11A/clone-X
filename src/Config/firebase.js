// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx6DCmK7w9EqJJr7q-401fS0qAQcXFEoE",
  authDomain: "clonex-9e50e.firebaseapp.com",
  projectId: "clonex-9e50e",
  storageBucket: "clonex-9e50e.appspot.com",
  messagingSenderId: "454655091311",
  appId: "1:454655091311:web:6350b0b3485db01a7b639a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase inicializado");
console.log("Storage bucket:", storage.app.options.storageBucket);

export { db, storage };
