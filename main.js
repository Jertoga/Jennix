// Firebase importeren (bovenaan)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyDsb7m4EijaU3NNxwoos8y6egI29nfbChk",
  authDomain: "jennix-777e1.firebaseapp.com",
  projectId: "jennix-777e1",
  storageBucket: "jennix-777e1.appspot.com",
  messagingSenderId: "673075142639",
  appId: "1:673075142639:web:ea93e3ae1b244463ca201a",
  measurementId: "G-HKJ85NVGF4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elementen ophalen
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");
const logoutBtn = document.getElementById("logoutBtn");
const forumSection = document.getElementById("forumSection");
const postBtn = document.getElementById("postBtn");
const postText = document.getElementById("postText");
const postsDiv = document.getElementById("posts");

// Sign In formulier
signInForm.onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Successfully signed in!");
      closeSignInModal();
    })
    .catch(err => alert("Error: " + err.message));
};

// Sign Up formulier
signUpForm.onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account successfully created!");
      closeSignUpModal();
    })
    .catch(err => alert("Error: " + err.message));
};

// Uitloggen
logoutBtn.onclick = () => {
  signOut(auth).then(() => {
    alert("Logged out");
    location.reload();
  });
};

// Auth Observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    forumSection.style.display = "block";
    logoutBtn.style.display = "inline";
    loadPosts();
  } else {
    forumSection.style.display = "none";
    logoutBtn.style.display = "none";
  }
});

// Post plaatsen
postBtn.onclick = async () => {
  const text = postText.value.trim();
  if (text !== "") {
    try {
      await addDoc(collection(db, "posts"), {
        text,
        timestamp: serverTimestamp()
      });
      postText.value = "";
    } catch (err) {
      alert("Error posting: " + err.message);
    }
  }
};

// Berichten laden
function loadPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    postsDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const post = doc.data();
      const p = document.createElement("p");
      p.textContent = post.text;
      postsDiv.appendChild(p);
    });
  });
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
