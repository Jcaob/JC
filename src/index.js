import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBi3gaYpP3p181ri_Z3scqlT4DSjAXSE8s",
  authDomain: "junglecook-4e31a.firebaseapp.com",
  projectId: "junglecook-4e31a",
  storageBucket: "junglecook-4e31a.appspot.com",
  messagingSenderId: "267300016965",
  appId: "1:267300016965:web:ef722b8e6938894f36e42c",
  measurementId: "G-JFFCNRLNX5",
};

var count = 3;
var countInst = 3;
var recipeArr = [];

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("logged in", user);
    $(".login").html("Logout");
  } else {
    console.log("no user");
    $(".login").html("Login");
  }
});

$(".test").on("click", () => {
  sign();
});

// $("#logIn").on("click", () => {
//   console.log("works");
// });

// $("#signIn").on("click", () => {
//   console.log("works");
// });

function login() {
  let email = $("#emailL").val();
  let password = $("#passwordL").val();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("ERROR MESSAGE: " + errorMessage);
    });
  changePage(window.location.hash, "browse");
}

function signUp() {
  let email = $("#emailC").val();
  let password = $("#passwordC").val();
  let fName = $("#fNameC").val();
  let lName = $("#lnameC").val();

  console.log("user " + fName + " " + lName + " " + email + " " + password);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("ERROR MESSAGE: " + errorMessage);
    });
  changePage(window.location.hash, "browse");
}

function sign() {
  signOut(auth)
    .then(() => {
      // Signed up
      console.log("Signed Out");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("ERROR MESSAGE: " + errorMessage);
    });
}

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  $("#bread-crumb").html(``);
  // if (pageID == "logInbtn") {
  //   // this is for logging in

  //   login();
  // } else if (pageID == "SignUpbtn") {
  //   // this is for creating account
  //   logout();
  // } else {
  //   changePage(hashTag, pageID);
  // }
  switch (pageID) {
    case "logInbtn":
      login();
      break;
    case "SignUpbtn":
      signUp();
      break;
    case "add":
      inputAdd();
      break;
    case "form":
      grabFormData();
      break;
    default:
      changePage(hashTag, pageID);
  }
}

function inputAdd() {
  $(".addIng").on("click", (e) => {
    count++;
    $(".formIng").append(
      `<input type="text" placeholder="Recipe Ingredient ${count}" id="desc${
        count - 1
      }" />`
    );
  });

  $(".addInst").on("click", (e) => {
    countInst++;
    $(".formInst").append(
      `<input type="text" placeholder="Recipe Instruction ${countInst}" id="isnt${
        countInst - 1
      }" />`
    );
  });
}

function grabFormData() {
  $(".submit").on("click", (e) => {
    let newItemObj = {};
    let imagePath = $("#imagePath").val();
    let ItemName = $("#ItemName").val();
    let recipeDes = $("#recipeDes").val();
    let rescipeTT = $("#rescipeTT").val();
    let rescepeSS = $("#rescepeSS").val();

    newItemObj.imagePath = imagePath;
    newItemObj.ItemName = ItemName;
    newItemObj.recipeDes = recipeDes;
    newItemObj.rescipeTT = rescipeTT;
    newItemObj.rescepeSS = rescepeSS;
    console.log(imagePath + " " + newItemObj.ItemName);

    newItemObj.Ingredients = [];

    $(".formIng input").each(function (index, data) {
      var value = $(this).val();
      if (value != "") {
        let keyName = "Ingredient" + index;
        let ingObj = {};
        ingObj[keyName] = value;
        newItemObj.Ingredients.push(ingObj);
        console.log("Desc ", newItemObj);
      } else {
      }
    });
    newItemObj.Instructions = [];
    $(".formInst input").each(function (index, data) {
      var value = $(this).val();
      if (value != "") {
        let keyName = "Instructions" + index;
        let instObj = {};
        instObj[keyName] = value;
        newItemObj.Instructions.push(instObj);
        console.log(value);
      } else {
      }
    });

    recipeArr.push(newItemObj);
    console.log("Recipes ", recipeArr);
    changePage(window.location.hash, "browse");
  });
}

function initSite() {
  $(window).on("hashchange", route);
  route();
}

$(document).ready(function () {
  initSite();
});

$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
});

function changePage(hashTag, pageName) {
  $("#bread-crumb").html(``);
  if (pageName == "") {
    $.get(`pages/home.html`, (data) => {
      $("#app").html(data);
    }).fail(() => {
      console.log("failed");
    });
  } else {
    $("#bread-crumb").html(`<a href="${hashTag}">${pageName}</a>`);
    $.get(`pages/${pageName}.html`, (data) => {
      if (data) {
        $("#app").html(data);
      } else {
        alert("no");
      }
    }).fail(() => {
      console.log("nah");
    });
  }
}
