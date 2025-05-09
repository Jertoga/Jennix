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
