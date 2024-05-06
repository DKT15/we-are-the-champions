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
  let likeCount = 0;

  //pushing data to the database if the user has completed all the fields.
  if (endorsementValue && fromValue && toValue) {
    clearInput();
    push(championsInDB, [endorsementValue, fromValue, toValue, likeCount]);
  } else {
    clearInput();
  }
});

onValue(championsInDB, function (snapshot) {
  if (snapshot.exists()) {
    // will only fetch items from the database if there is any
    let commentsArray = Object.entries(snapshot.val()); //converts snapshot.val() from an object to an Array. Entries gives both the id and value in the array.

    //stops the duplication of data in the endorsementEl by clearing it before adding the new comment.
    clearEndorsementEl();

    for (var i = 0; i < commentsArray.length; i++) {
      let comments = commentsArray[i];
      addComment(comments); //appends each item to the comment element for each iteration.
    }
  }
});

// function to add each comment.
function addComment(comment) {
  let commentId = comment[0];
  let commentData = comment[1];
  let commentInput = commentData[0];
  let commentFrom = commentData[1];
  let commentTo = commentData[2];
  let commentLike = commentData[3];

  // creating each element needed for comments.
  let newEl = document.createElement("li");
  let contentEl = document.createElement("div");
  let toInputEl = document.createElement("h3");
  let fromInputEl = document.createElement("h3");
  let endorsementInputEl = document.createElement("p");
  let likeFromContainer = document.createElement("div");
  let likesEl = document.createElement("button");

  //assigning the values entered into the input onto the elements created above.
  toInputEl.textContent = `To ${commentTo}`;
  endorsementInputEl.textContent = commentInput;
  fromInputEl.textContent = `From ${commentFrom}`;
  likesEl.innerText = `👍 ${commentLike}`;

  newEl.appendChild(contentEl);
  contentEl.appendChild(toInputEl);
  contentEl.appendChild(endorsementInputEl);
  contentEl.appendChild(likeFromContainer);
  likeFromContainer.appendChild(fromInputEl);
  likeFromContainer.appendChild(likesEl);

  //assigning classes to each element.
  contentEl.classList.add("content");
  toInputEl.classList.add("to-text");
  fromInputEl.classList.add("from-text");
  endorsementInputEl.classList.add("endorsement-text");
  likeFromContainer.classList.add("like-from-container");
  likesEl.classList.add("like-btn");

  // allows users to like a comment.
  likesEl.addEventListener("click", function () {
    commentLike++;

    let likesInDB = ref(database, `listOfComments/${commentId}`);
    update(likesInDB, {
      3: commentLike,
    });
  });

  //adds the most recent comment to the top of the endorsementEl.
  endorsementEl.prepend(newEl);
}

//clears input fields.
function clearInput() {
  endorsementInputEl.value = "";
  fromInputEl.value = "";
  toInputEl.value = "";
}

//clears the endorsementEl.
function clearEndorsementEl() {
  endorsementEl.innerHTML = "";
}
