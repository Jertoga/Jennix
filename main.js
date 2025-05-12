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

// Sign Up
document.getElementById("signUpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Account succesvol aangemaakt!");
            closeSignUpModal();
        })
        .catch((error) => {
            alert("Fout: " + error.message);
        });
});

// Sign In
document.getElementById("signInForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signInEmail").value;
    const password = document.getElementById("signInPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Ingelogd!");
            closeSignInModal();
            updateUI(userCredential.user);
        })
        .catch((error) => {
            alert("Fout: " + error.message);
        });
});

// UI aanpassen
function updateUI(user) {
    const nav = document.querySelector("nav ul");
    const signInBtn = document.querySelector(".sign-in-button");

    if (user) {
        if (signInBtn) {
            signInBtn.remove(); // Verwijder "Log in"
        }

        // Voeg "Dashboard"-knop toe
        if (!document.getElementById("dashboardBtn")) {
            const dashboardLi = document.createElement("li");
            dashboardLi.id = "dashboardBtn";
            dashboardLi.innerHTML = `<a href="/dashboard.html" class="sign-in-button">Dashboard</a>`;
            nav.appendChild(dashboardLi);
        }

        // Voeg "Logout"-knop toe
        if (!document.getElementById("logoutBtn")) {
            const logoutLi = document.createElement("li");
            logoutLi.id = "logoutBtn";
            logoutLi.innerHTML = `<button onclick="logout()" class="sign-in-button">Log Out</button>`;
            nav.appendChild(logoutLi);
        }
    }
}

// Logout
function logout() {
    signOut(auth).then(() => {
        alert("Uitgelogd");
        location.reload();
    });
}

// Check loginstatus
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUI(user);
    }
});
