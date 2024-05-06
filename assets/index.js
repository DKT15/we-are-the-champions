const endorsementInputEl = document.getElementById("endorsement-input");
const fromInputEl = document.getElementById("from-input");
const toInputEl = document.getElementById("to-input");
const endorsementEl = document.getElementById("endorsement-section");
const publishBtnEl = document.getElementById("publish-btn");

//set type to module in HTML file as the import has been used.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-are-the-champions-50893-default-rtdb.europe-west1.firebasedatabase.app/",
};

// initializeApp is given the appSettings argument. This will connect the project with firebase.
const app = initializeApp(appSettings);

//database variable that will pass in the app as an argument.
const database = getDatabase(app);

//setting up the reference. It is imported above. The ref takes in the database and then it is called listOfComments.
const championsInDB = ref(database, "listOfComments");

// when the button is clicked. The data entred by the user in the three fields will be stored in the firebase database.
publishBtnEl.addEventListener("click", function () {
  let endorsementValue = endorsementInputEl.value;
  let fromValue = fromInputEl.value;
  let toValue = toInputEl.value;

  if (endorsementValue && fromValue && toValue) {
    clearInput();
    push(championsInDB, [endorsementValue, fromValue, toValue, 0]);
  } else {
    clearInput();
  }
});

onValue(championsInDB, function (snapshot) {
  clearEndorsementEl();

  if (snapshot.exists()) {
    // will only fetch items from the database if there is any
    let commentsArray = Object.entries(snapshot.val()); //converts snapshot.val() from an object to an Array. Entries gives both the id and value in the array.

    for (var i = 0; i < commentsArray.length; i++) {
      let comments = commentsArray[i];

      addComment(comments); //appends each item to the comment element for each iteration.
    }
  }
});

function addComment(comment) {
  let commentId = comment[0];
  let commentData = comment[1];
  let commentInput = commentData[0];
  let commentFrom = commentData[1];
  let commentTo = commentData[2];
  let commentLike = commentData[3];

  let newEl = document.createElement("li");
  let contentEl = document.createElement("div");
  let toInputEl = document.createElement("h3");
  let fromInputEl = document.createElement("h3");
  let endorsementInputEl = document.createElement("p");
  let likeFromContainer = document.createElement("div");
  let likesEl = document.createElement("button");

  toInputEl.textContent = `To ${commentTo}`;
  endorsementInputEl.textContent = commentInput;
  fromInputEl.textContent = `From ${commentFrom}`;
  likesEl.textContent = `👍`;

  newEl.appendChild(contentEl);
  contentEl.appendChild(toInputEl);
  contentEl.appendChild(endorsementInputEl);
  contentEl.appendChild(likeFromContainer);
  likeFromContainer.appendChild(fromInputEl);
  likeFromContainer.appendChild(likesEl);

  contentEl.classList.add("content");
  toInputEl.classList.add("to-text");
  fromInputEl.classList.add("from-text");
  endorsementInputEl.classList.add("endorsement-text");
  likeFromContainer.classList.add("like-from-container");
  likesEl.classList.add("like-btn");

  likesEl.addEventListener("click", function () {
    commentLike += 1;
    likesEl.innerText = `👍 ${commentLike}`;

    let likesInDB = ref(database, `like/${commentId}`);
    update(likesInDB, {
      3: commentLike,
    });
  });

  endorsementEl.prepend(newEl);
}

function clearInput() {
  endorsementInputEl.value = "";
  fromInputEl.value = "";
  toInputEl.value = "";
}

function clearEndorsementEl() {
  endorsementEl.innerHTML = "";
}
