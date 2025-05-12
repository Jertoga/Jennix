// Firebase importeren (bovenaan)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Firebase configuratie
const firebaseConfig = {
    apiKey: "JOUW_API_KEY",
    authDomain: "JOUW_PROJECT_ID.firebaseapp.com",
    projectId: "JOUW_PROJECT_ID",
    storageBucket: "JOUW_PROJECT_ID.appspot.com",
    messagingSenderId: "JOUW_SENDER_ID",
    appId: "JOUW_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

window.onclick = function(event) {
    if (event.target === document.getElementById("signInModal")) closeSignInModal();
    if (event.target === document.getElementById("signUpModal")) closeSignUpModal();
};

// Sign Up formulier
document.getElementById("signUpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Account successfully created!");
            closeSignUpModal();
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// Sign In formulier
document.getElementById("signInForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signInEmail").value;
    const password = document.getElementById("signInPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Successfully signed in!");
            closeSignInModal();
            updateUI(userCredential.user);
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// UI bijwerken bij login/logout
function updateUI(user) {
    const nav = document.querySelector("nav ul");
    const signInBtn = document.querySelector(".sign-in-button");

    if (user) {
        signInBtn.style.display = "none";

        const li = document.createElement("li");
        li.id = "logoutBtn";
        li.innerHTML = `<button onclick="logout()" class="sign-in-button">Log Out</button>`;
        nav.appendChild(li);
    }
}

// Logout functie
function logout() {
    signOut(auth).then(() => {
        alert("Logged out");
        location.reload();
    });
}

// Check of user al is ingelogd
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUI(user);
    }
});
