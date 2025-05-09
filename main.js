// Functie om de community te joinen
function joinCommunity() {
    alert("Thanks for joining the Jenna Ortega fan community!");
}

// Modal functies
function openSignInModal() {
    document.getElementById("signInModal").style.display = "flex";
}

function closeSignInModal() {
    document.getElementById("signInModal").style.display = "none";
}

function openSignUpModal() {
    document.getElementById("signUpModal").style.display = "flex";
}

function closeSignUpModal() {
    document.getElementById("signUpModal").style.display = "none";
}

function switchToSignUp() {
    closeSignInModal();
    openSignUpModal();
}

function switchToSignIn() {
    closeSignUpModal();
    openSignInModal();
}

// Close modal if clicking outside
window.onclick = function(event) {
    if (event.target === document.getElementById("signInModal")) {
        closeSignInModal();
    }
    if (event.target === document.getElementById("signUpModal")) {
        closeSignUpModal();
    }
};

// Firebase configuratie
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Inloggen
document.getElementById("signInForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signInEmail").value;
    const password = document.getElementById("signInPassword").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Logged in as: " + userCredential.user.email);
            window.location.href = "forum.html"; // Doorsturen naar het forum
        })
        .catch((error) => {
            alert("Error: " + error.message); // Foutmelding tonen bij inlogfout
        });
});

// Registreren
document.getElementById("signUpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Account created: " + userCredential.user.email); // Account gecreëerd
            closeSignUpModal();
            openSignInModal(); // Schakel naar het inlogscherm na registratie
        })
        .catch((error) => {
            alert("Error: " + error.message); // Foutmelding tonen bij registratiefout
        });
});
