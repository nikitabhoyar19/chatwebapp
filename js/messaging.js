var db= firebase.firestore();
let username = document.getElementById("username");
let profile = document.querySelectorAll("#profile");
let message__sendBtn = document.getElementById("message__send");
let messageContainer = document.getElementById("message-container");
message__sendBtn.addEventListener("click", sendFunction);

function sendFunction() {
  // agar user hai to add this messag to db
  let messagetext = document.getElementById("message__text").value;
  // agar message inpu is black to return ho jayega
  if (messagetext == "") {
    return;
  }

  // It will console the msg
  console.log(messagetext);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("this is in send meesgae function ", user);

      // db connection with  messages
      db.collection("messages")
        .add({
          message: messagetext,
          username: user.displayName,
          email: user.email,
          photo: user.photoURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function (docRef) {
          // afte bd me add hone pr ye cobsole .log krega
          console.log("message send");
        })
        .catch(function (error) {
          //error catch
          console.error("Error adding document: ", error);
        });
    }
  });
}

console.log(profile);
let logout__btn = document.getElementById("logout");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user);
    console.log(" user alredy loged in");

    profile.forEach((item) => {
      item.src = user.photoURL;
    });
    document.getElementById("name").textContent = user.displayName;
  } else {
    window.location.replace("/index.html");
  }
});

logout__btn.addEventListener("click", logoutMe);

function logoutMe() {
  firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    db.collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const messageTemplate = ` 
      <div
      class="message mt-4"
      style="padding: 10px; border-radius: 10px"
    >
      <!-- this is my message head contain img name and time-->
      <div class="message_head d-flex align-items-center">
        <img
          src="${change.doc.data().photo}"
          class="rounded-circle"
          width="40px"
        />

        <p style="margin: 0; padding: 0; padding-left: 10px; flex: 1">
         ${change.doc.data().username}
        </p>
        
      </div>
      <!-- this is my message -->
      <p class="mt-3 px-2">${change.doc.data().message}</p>
    </div>`;
            messageContainer.insertAdjacentHTML("afterbegin", messageTemplate);

            const smallmessageTemplate = `       
      <div class="chatmessage ${
        change.doc.data().username == user.displayName ? "mine" : ""
      }  d-flex align-items-center">
      <img
        class="rounded-circle"
        width="40px"
        src="${change.doc.data().photo}"
        alt=""
      />
      <p style="padding: 0; margin: 0 10px">${change.doc.data().message}</p>
    </div>
    `;
            document
              .getElementById("chatmessages")
              .insertAdjacentHTML("afterbegin", smallmessageTemplate);
          }
        });
      });
  }
});

