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
  doc,
  updateDoc,
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
let page = "";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("logged in", user);
    $(".login").html("Logout");
    $(".userRes").append(`<a href="#userRecipes" >Your Recipes</a>`);
  } else {
    console.log("no user");
    $(".login").html("Login");
    $(".userRes").html(``);
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
    case "update":
      grabEditFormData();
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

function setPage() {
  $(".setpage").on("click", () => {
    $(".setpage").addClass("setpage selected");

    let id = $(".selected").attr("id");
    page = id;
    console.log("id is", id);
  });
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

function grabEditFormData() {
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

    editDataRecipes(recipe);
    console.log(recipe);
    changePage(window.location.hash, "browse");
    count = 3;
    countInst = 3;
  });
}

async function addDataRecipes(recipe) {
  try {
    const docRef = await addDoc(collection(db, "Recipes"), recipe);
    const uid = doc.id;

    console.log("doc id:", docRef.id, "uid", uid);
  } catch (e) {
    console.log(e);
  }
}

async function editDataRecipes(recipe) {
  try {
    const docRef = doc(db, "Recipes", page);

    const uid = doc.id;

    await updateDoc(docRef, {
      imagePath: recipe.imagePath,
      ItemName: recipe.ItemName,
      recipeDes: recipe.recipeDes,
      rescipeTT: recipe.recipeTT,
      rescepeSS: recipe.rescepeSS,
      Ingredients: recipe.Ingredients,
      Instructions: recipe.Instructions,
    });
  } catch (e) {
    console.log(e);
  }

  // Set the "capital" field of the city 'DC'
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

async function getEditRecipe() {
  let docID = page;
  const docRef = doc(db, "Recipes", docID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Edit Document data:", docSnap.data().recipeTT);
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  document.getElementById("edit-container").innerHTML += `
  <div id="spacer">
  <div class="form-holder">
    <h1>Edit your recipe!</h1>
    <div class="formTop">
      <a href="#upload"><div class="imageBtn">Upload File</div></a>
      <input type="file" placeholder="Image URL/ Image Name" id="imagePath" />
      <input type="text" id="setter" />
      <input type="text" placeholder="${
        docSnap.data().ItemName
      }" id="ItemName" />
      <input type="text" placeholder="${
        docSnap.data().recipeDes
      }" id="recipeDes" />
      <input type="text" placeholder="${
        docSnap.data().rescipeTT
      }" id="rescipeTT" />
      <input type="text" placeholder="${
        docSnap.data().rescepeSS
      }" id="rescepeSS" />
    </div>
    <div class="formIng">
      <input type="text" placeholder="Recipe Ingredient 1" id="desc0" />
      <input type="text" placeholder="Recipe Ingredient 2" id="desc1" />
      <input type="text" placeholder="Recipe Ingredient 3" id="desc2" />
      <a class="addIng" href="#add">+</a>
    </div>
    <div class="formInst">
      <input type="text" placeholder="Recipe Instruction 1" id="inst0" />
      <input type="text" placeholder="Recipe Instruction 2" id="isnt1" />
      <input type="text" placeholder="Recipe Instruction 3" id="isnt2" />
      <a class="addInst" href="#add">+</a>
    </div>
    <a href="#update" class="submit btn">SUBMIT</a>
  </div>
</div>
  `;
}

async function getUserDisplayRecipes() {
  const querySnapshot = await getDocs(collection(db, "Recipes"));

  querySnapshot.forEach((doc) => {
    // console.log(doc.id);
    let id = doc.id;

    document.getElementById(
      "display-grid-user"
    ).innerHTML += `<div class="display-Recipes">
    <a href="#detail" class="setpage" id=${doc.id}>
    <div class="display-card">
      <div class="display-containter">
      <img src="${doc.data().imagePath}" class="display-image" />
      </div>
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
    </a>
  </div>`;

    setPage();
    console.log(id);
  });
}

async function getRecipeData() {
  let docID = page;
  const docRef = doc(db, "Recipes", docID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  document.getElementById("detail-container").innerHTML += `
  <div class="recipe-detail-holder">
  <div class="recipe-detail-container">
  <h1 class="recipe-title" style="writing-mode: tb-rl;">${
    docSnap.data().ItemName
  }</h1>
      <div class="recipe-head">
        <img src="${docSnap.data().imagePath}">
        <div class="recipe-detail-info">
          <h1>Description:</h1>
          <p>${docSnap.data().recipeDes}</p>
          <h1 class="recipe-info-title">Total Time:</h1>
          <p>${docSnap.data().rescipeTT}</p>
          <h1 class="recipe-info-title">Serving Size:</h1>
          <p>${docSnap.data().rescepeSS}</p>
        </div>
      </div>
      <div class="recipe-array">
        <h1>Ingredients:</h1>
        <p>${docSnap.data().Ingredients[0].Ingredient0}</p>
        <p>${docSnap.data().Ingredients[1].Ingredient1}</p>
        <p>${docSnap.data().Ingredients[2].Ingredient2}</p>
        ${
          docSnap.data().Ingredients[3]?.Ingredient3
            ? `<p>${docSnap.data().Ingredients[3].Ingredient3}</p>`
            : ""
        }
        ${
          docSnap.data().Ingredients[4]?.Ingredient4
            ? `<p>${docSnap.data().Ingredients[4].Ingredient4}</p>`
            : ""
        }
        ${
          docSnap.data().Ingredients[5]?.Ingredient5
            ? `<p>${docSnap.data().Ingredients[5].Ingredient5}</p>`
            : ""
        }
        ${
          docSnap.data().Ingredients[6]?.Ingredient6
            ? `<p>${docSnap.data().Ingredients[6].Ingredient6}</p>`
            : ""
        }
        ${
          docSnap.data().Ingredients[7]?.Ingredient7
            ? `<p>${docSnap.data().Ingredients[7].Ingredient7}</p>`
            : ""
        }
      </div>
      <div class="recipe-array">
      <h1>Instructions:</h1>
      <p>1.${docSnap.data().Instructions[0].Instructions0}</p>
      <p>2.${docSnap.data().Instructions[1].Instructions1}</p>
      <p>3.${docSnap.data().Instructions[2].Instructions2}</p>
      ${
        docSnap.data().Instructions[3]?.Instructions3
          ? `<p>4.${docSnap.data().Instructions[3].Instructions3}</p>`
          : ""
      }
      ${
        docSnap.data().Instructions[4]?.Instructions4
          ? `<p>5.${docSnap.data().Instructions[4].Instructions4}</p>`
          : ""
      }
      ${
        docSnap.data().Instructions[5]?.Instructions5
          ? `<p>6.${docSnap.data().Instructions[5].Instructions5}</p>`
          : ""
      }
      ${
        docSnap.data().Instructions[6]?.Instructions6
          ? `<p>7.${docSnap.data().Instructions[6].Instructions6}</p>`
          : ""
      }
      ${
        docSnap.data().Instructions[7]?.Instructions7
          ? `<p>8.${docSnap.data().Instructions[7].Instructions7}</p>`
          : ""
      }
    </div>
    <a href="#edit"><div class="recipe-edit-button">Edit</div></a>
  </div>
      
  </div>
  
  `;
}

function initSite() {
  $(window).on("hashchange", route);
  $(window).on("hashchange", getDisplayRecipes);
  $(window).on("hashchange", getUserDisplayRecipes);
  $(window).on("hashchange", getRecipeData);
  $(window).on("hashchange", getEditRecipe);
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
