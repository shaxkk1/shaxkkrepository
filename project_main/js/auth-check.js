// Check if user is logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
    }
});