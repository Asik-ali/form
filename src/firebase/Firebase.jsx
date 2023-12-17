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



    // original

    // apiKey: "AIzaSyDIn4X6xBB-rZeqCuaO_h8ONcZCtNLjD-w",
    // authDomain: "alumni-bc761.firebaseapp.com",
    // projectId: "alumni-bc761",
    // storageBucket: "alumni-bc761.appspot.com",
    // messagingSenderId: "922639322609",
    // appId: "1:922639322609:web:c07243a25a2302d9ff4850"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app)







export { fireDB, auth , storage};
