function joinCommunity() {
    alert("Thanks for joining the Jenna Ortega fan community!");
}

function openSignIn() {
    document.getElementById("signInModal").style.display = "flex";
}

function closeSignIn() {
    document.getElementById("signInModal").style.display = "none";
}

// Close modal if clicked outside of it
window.onclick = function(event) {
    if (event.target === document.getElementById("signInModal")) {
        closeSignIn();
    }
};

 // Firebase configuratie en functies
        import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

        // Firebase config
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID"
        };

        // Initialiseer Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        // Functie om in te loggen
        function signIn(email, password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("Ingelogd als:", user.email);
                    window.location.href = "forum.html";  // Doorsturen naar forum na inloggen
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("Error tijdens inloggen:", errorCode, errorMessage);
                });
        }

        // Functie om het inlogmodal te openen
        function openLoginModal() {
            document.getElementById("loginModal").style.display = "block";
        }

        // Functie om het inlogmodal te sluiten
        function closeLoginModal() {
            document.getElementById("loginModal").style.display = "none";
        }

        // Event listener voor het inlogformulier
        document.getElementById("signInForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("signInEmail").value;
            const password = document.getElementById("signInPassword").value;
            signIn(email, password);
        });
