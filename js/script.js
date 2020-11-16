/* @format */

let google= document.getElementById("googlelogin");
google.addEventListener("click", loginWithGoogle);

function loginWithGoogle() {
    var provider= new firebase.auth.GoogleAuthProvider();

    firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
        var user= result.user;
        console.log("This is", user);
        console.log("This is my photo", user.photoURL);
        console.log("This is my name", user.displayName);
        console.log("This is my email", user.email);
        
        window.location.replace(" /messaging.html");

    })
    .catch(function (error) {
        console.log(error);
    });
}
















