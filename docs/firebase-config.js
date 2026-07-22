import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrYItXUqdvCs181pOjcKM2rojKxNlV458",
    authDomain: "studybuddy-545e6.firebaseapp.com",
    projectId: "studybuddy-545e6",
    storageBucket: "studybuddy-545e6.firebasestorage.app",
    messagingSenderId: "608044097764",
    appId: "1:608044097764:web:e5524be095c940fb590cf1",
    measurementId: "G-HKLJ6R523P"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
