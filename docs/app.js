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
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

const form = document.getElementById("loginForm");
const submitBtn = document.getElementById("submitBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const messageEl = document.getElementById("message");

let mode = "login"; // or "signup"

function setMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = text ? `message ${type}` : "message";
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading
        ? "One moment…"
        : (mode === "login" ? "Log in" : "Create account");
}

toggleModeBtn.addEventListener("click", () => {
    mode = mode === "login" ? "signup" : "login";
    submitBtn.textContent = mode === "login" ? "Log in" : "Create account";
    toggleModeBtn.textContent = mode === "login"
        ? "Create an account instead"
        : "Log in instead";
    setMessage("", "");
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    setMessage("", "");

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;

    if (!email || !pass) {
        setMessage("Enter both an email and a password.", "error");
        return;
    }

    setLoading(true);

    const action = mode === "login"
        ? signInWithEmailAndPassword(auth, email, pass)
        : createUserWithEmailAndPassword(auth, email, pass);

    action
        .then(() => {
            if (mode === "signup") {
                setMessage("Account created. Taking you in…", "info");
            }
            window.location.href = "Study.html";
        })
        .catch((err) => {
            setLoading(false);
            setMessage(friendlyError(err.code), "error");
        });
});

function friendlyError(code) {
    switch (code) {
        case "auth/invalid-email":
            return "That email address doesn't look right.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Email or password is incorrect.";
        case "auth/email-already-in-use":
            return "An account already exists for that email.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        default:
            return "Something went wrong. Please try again.";
    }
}

