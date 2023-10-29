import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("logged in", user);
  } else {
    console.log("no user");
  }
});

$("#login").on("click", () => {
  console.log("works");
});

$("#signin").on("click", () => {
  console.log("works");
});

function login() {
  signInAnonymously(auth)
    .then(() => {
      console.log("signed In");
    })
    .catch((error) => {
      console.log("help");
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      console.log("signed out");
    })
    .catch((error) => {
      console.log("help");
    });
}

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  $("#bread-crumb").html(``);
  changePage(hashTag, pageID);
}

function initListeners() {}

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
