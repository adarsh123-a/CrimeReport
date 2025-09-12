// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9uWHf9Tw1jzPhbZg8dAkxonL4FJmFPB4",
  authDomain: "crimereport-3f796.firebaseapp.com",
  databaseURL:
    "https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crimereport-3f796",
  storageBucket: "crimereport-3f796.firebasestorage.app",
  messagingSenderId: "394145403393",
  appId: "1:394145403393:web:754d6455d4a6a859f46600",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
