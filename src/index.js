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

// var id = document.getElementById("ham-icon");

// id.addEventListener("click", toggleMenu);

// function toggleMenu() {
//   id.classList.toggle("open");
//   console.log("works");
// }

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
