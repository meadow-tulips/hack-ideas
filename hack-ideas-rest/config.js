// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import 'dotenv/config'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "hack-ideas-f8e0a",
  storageBucket: "hack-ideas-f8e0a.appspot.com",
  messagingSenderId: "497933381890",
  appId: "1:497933381890:web:ec678b89d4d3516beb921b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStoreDB = getFirestore(app);

export {
  fireStoreDB
}


// const querySnapshot = await getDocs(collection(db, "cities"));
// querySnapshot.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
// });