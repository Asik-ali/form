// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAbGBNqDlWjGoLam5_YdGt5IC-6zryEQAs",
    authDomain: "alumni-25c51.firebaseapp.com",
    projectId: "alumni-25c51",
    storageBucket: "alumni-25c51.appspot.com",
    messagingSenderId: "800521501057",
    appId: "1:800521501057:web:b235ee91a179d1661a1080"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app)







export { fireDB, auth , storage};
