// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDfrI1VRwClEfV8MRZYoWQG0xHTa3QvsPE",
    authDomain: "voyagelankav1.firebaseapp.com",
    projectId: "voyagelankav1",
    storageBucket: "voyagelankav1.appspot.com",
    messagingSenderId: "548858352299",
    appId: "1:548858352299:web:5128301609fb1540b61dee",
    measurementId: "G-M2RFBY8N4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
