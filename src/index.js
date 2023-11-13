import { async } from "@firebase/util";
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  getFirestore,
  getDoc,
  collection,
  addDoc,
  where,
  getDocs,
  query,
} from "firebase/firestore";

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
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

var count = 3;
var countInst = 3;
var recipeArr = [];

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);

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
    case "upload":
      upload();
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

function upload() {
  let file = $("#imagePath").get(0).files[0];
  let fileName = +new Date() + "-" + file.name;
  let metadata = { contentType: file.type };

  let pathRef = ref(storage, "images/" + fileName);
  const storageRef = ref(storage, pathRef);

  //   const uploadTask = uploadBytes(storageRef, file).then((snapshot) => {
  //     getDownloadURL(snapshot.ref).then((DownloadURL) => {
  //       console.log("file avalible at ", DownloadURL);
  //     });
  //   });

  const uploadTask = uploadBytesResumable(storageRef, file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      $(".bar").css("width", progress + "%");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File Done Here da URL", downloadURL);
        $("#setter").val(downloadURL);
      });
    }
  );
}

function grabFormData() {
  $(".submit").on("click", (e) => {
    let imagePath = $("#setter").val();
    let ItemName = $("#ItemName").val();
    let recipeDes = $("#recipeDes").val();
    let rescipeTT = $("#rescipeTT").val();
    let rescepeSS = $("#rescepeSS").val();

    let recipe = {
      imagePath: imagePath,
      ItemName: ItemName,
      recipeDes: recipeDes,
      rescipeTT: rescipeTT,
      rescepeSS: rescepeSS,
      Ingredients: [],
      Instructions: [],
    };

    $(".formIng input").each(function (index, data) {
      var value = $(this).val();
      if (value != "") {
        let keyName = "Ingredient" + index;
        let ingObj = {};
        ingObj[keyName] = value;
        recipe.Ingredients.push(ingObj);
      } else {
      }
    });

    $(".formInst input").each(function (index, data) {
      var value = $(this).val();
      if (value != "") {
        let keyName = "Instructions" + index;
        let instObj = {};
        instObj[keyName] = value;
        recipe.Instructions.push(instObj);
        console.log(value);
      } else {
      }
    });

    addDataRecipes(recipe);
    console.log(recipe);
    changePage(window.location.hash, "browse");
    count = 3;
    countInst = 3;
  });
}

async function addDataRecipes(recipe) {
  try {
    const docRef = await addDoc(collection(db, "Recipes"), recipe);

    console.log("doc id:", docRef.id);
  } catch (e) {
    console.log(e);
  }
}

async function getDisplayRecipes() {
  const querySnapshot = await getDocs(collection(db, "DisplayRecipes"));

  querySnapshot.forEach((doc) => {
    console.log("get all data");
    document.getElementById(
      "display-grid"
    ).innerHTML += `<div class="display-Recipes">
    <div class="display-card">
  
      <img src="${doc.data().imagePath}" class="display-image" />
      <div class="display-info">
        <h1 class="display-title">${doc.data().ItemName}</h1>
        <p class="display-des">
        ${doc.data().recipeDes}
        </p>
        <div class="display-time"><img src="" alt="" />${
          doc.data().rescipeTT
        }</div>
        <div class="display-servings"><img src="" alt="" />${
          doc.data().rescepeSS
        }</div>
      </div>
    </div>
  </div>`;
  });
}

function initSite() {
  $(window).on("hashchange", route);
  $(window).on("hashchange", getDisplayRecipes);
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
