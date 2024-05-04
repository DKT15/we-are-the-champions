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

  push(championsInDB, [endorsementValue, fromValue, toValue]);

  clearInput();
});

onValue(championsInDB, function (snapshot) {
  if (snapshot.exists()) {
    // will only fetch items from the database if there is any
    let commentsArray = Object.entries(snapshot.val()); //converts snapshot.val() from an object to an Array. Entries gives both the id and value in the array.

    clearEndorsementEl();

    for (var i = 0; i < commentsArray.length; i++) {
      let comments = commentsArray[i];

      addComment(comments); //appends each item to the comment element for each iteration.
    }
  } else {
    endorsementEl.innerHTML = "No feedback yet.";
  }
});

function addComment(comment) {
  let commentId = comment[0];
  let commentData = comment[1];
  let commentInput = commentData[0];
  let commentFrom = commentData[1];
  let commentTo = commentData[2];

  let newEl = $("<li>");
  let contentEl = $("<div>");
  let toInputEl = $("<h3>");
  let fromInputEl = $("<h3>");
  let endorsementInputEl = $("<p>");
  let likeFromContainer = $("<div>");

  toInputEl.textContent = `To ${commentTo}`;
  endorsementInputEl.textContent = commentInput;
  fromInputEl.textContent = `From ${commentFrom}`;

  newEl.appendChild(contentEl);
  contentEl.appendChild(toInputEl);
  contentEl.appendChild(endorsementInputEl);
  contentEl.appendChild(likeFromContainer);
  likeFromContainer.appendChild(fromInputEl);

  contentEl.addClass("content");
  toInputEl.addClass("to-text");
  fromInputEl.addClass("from-text");
  endorsementInputEl.addClass("endorsement-text");
  likeFromContainer.addClass("like-from-container");

  endorsementEl.append(newEl);
}

function clearInput() {
  endorsementInputEl.value = "";
  fromInputEl.value = "";
  toInputEl.value = "";
}

function clearEndorsementEl() {
  endorsementEl.innerHTML = "";
}
