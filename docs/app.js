import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrYItXUqdvCs181pOjcKM2rojKxNlV458",
    authDomain: "studybuddy-545e6.firebaseapp.com",
    projectId: "studybuddy-545e6",
    storageBucket: "studybuddy-545e6.firebasestorage.app",
    messagingSenderId: "608044097764",
    appId: "1:608044097764:web:e5524be095c940fb590cf1",
    measurementId: "G-HKLJ6R523P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            window.location.href = "Study.html";
        })
        .catch(err => alert(err.message));
}

window.signup = function() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => {
            alert("Account created! Logging you in...");
            window.location.href = "Study.html";
        })
        .catch(err => alert(err.message));
}
