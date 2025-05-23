// firebase.js

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyDsb7m4EijaU3NNxwoos8y6egI29nfbChk",
    authDomain: "jennix-777e1.firebaseapp.com",
    projectId: "jennix-777e1",
    storageBucket: "jennix-777e1.firebasestorage.app",
    messagingSenderId: "673075142639",
    appId: "1:673075142639:web:ea93e3ae1b244463ca201a",
    measurementId: "G-HKJ85NVGF4"
};

// Firebase initialisatie
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Functie om afbeeldingen te uploaden naar Firebase
function uploadImage(file) {
    const storageRef = ref(storage, 'images/' + file.name);
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(snapshot.ref).then((url) => {
            console.log("File URL:", url);
            // Hier kun je de URL gebruiken om de afbeelding te tonen in de Gallery
        });
    });
}

// Exporteer de uploadImage functie om te gebruiken op je Gallery-pagina
export { uploadImage };

// Firebase Authentication
const auth = getAuth(app);

// Functie om een nieuw account aan te maken
function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Account succesvol aangemaakt
            const user = userCredential.user;
            console.log("Account aangemaakt voor: ", user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error tijdens registratie: ", errorCode, errorMessage);
        });
}

// Functie om in te loggen met een bestaand account
function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Succesvol ingelogd
            const user = userCredential.user;
            console.log("Ingelogd als: ", user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error tijdens inloggen: ", errorCode, errorMessage);
        });
}

// Functie om de inlogstatus van de gebruiker te controleren
function onUserStateChanged(callback) {
    onAuthStateChanged(auth, callback);
}

export { signUp, signIn, onUserStateChanged };