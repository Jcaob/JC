/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("function route() {\r\n  let hashTag = window.location.hash;\r\n  let pageID = hashTag.replace(\"#\", \"\");\r\n  $(\"#bread-crumb\").html(``);\r\n  changePage(hashTag, pageID);\r\n}\r\n\r\nfunction initListeners() {}\r\n\r\nfunction initSite() {\r\n  $(window).on(\"hashchange\", route);\r\n  route();\r\n}\r\n\r\n$(document).ready(function () {\r\n  initSite();\r\n});\r\n\r\n// var id = document.getElementById(\"ham-icon\");\r\n\r\n// id.addEventListener(\"click\", toggleMenu);\r\n\r\n// function toggleMenu() {\r\n//   id.classList.toggle(\"open\");\r\n//   console.log(\"works\");\r\n// }\r\n\r\n$(\".hamburger-icon\").on(\"click\", () => {\r\n  $(\".hamburger-icon\").toggleClass(\"open\");\r\n});\r\n\r\nfunction changePage(hashTag, pageName) {\r\n  $(\"#bread-crumb\").html(``);\r\n  if (pageName == \"\") {\r\n    $.get(`pages/home.html`, (data) => {\r\n      $(\"#app\").html(data);\r\n    }).fail(() => {\r\n      console.log(\"failed\");\r\n    });\r\n  } else {\r\n    $(\"#bread-crumb\").html(`<a href=\"${hashTag}\">${pageName}</a>`);\r\n    $.get(`pages/${pageName}.html`, (data) => {\r\n      if (data) {\r\n        $(\"#app\").html(data);\r\n      } else {\r\n        alert(\"no\");\r\n      }\r\n    }).fail(() => {\r\n      console.log(\"nah\");\r\n    });\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://junglecook/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;