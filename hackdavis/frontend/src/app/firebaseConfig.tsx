import { getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-wBzx6knaW8fCICR3HO44TecpjHfm-mY",
  authDomain: "hackdavis-6f410.firebaseapp.com",
  projectId: "hackdavis-6f410",
  storageBucket: "hackdavis-6f410.appspot.com",
  messagingSenderId: "205291670343",
  appId: "1:205291670343:web:c02f8225322febf45c9a62",
  measurementId: "G-LPWEX95LW0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore();

export {db};
