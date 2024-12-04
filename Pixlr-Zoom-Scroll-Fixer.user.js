// ==UserScript==
// @name Pixlr Zoom-Scroll Fixer
// @description Allows users to freely zoom or scroll over the canvas on Pixlr.com
// @version 1.0.0
// @icon https://repository-images.githubusercontent.com/898232906/8159eef6-78c2-4e2f-90cd-444efdf8409a
// @updateURL https://github.com/Oshanotter/Pixlr-Zoom-Scroll-Fixer/raw/refs/heads/main/Pixlr-Zoom-Scroll-Fixer.user.js
// @namespace Oshanotter
// @author Max Forst
// @include https://pixlr.com/*
// @run-at document-idle
// ==/UserScript==


function changeMode(mode, timesRepeated = 0) {
  /* try to change the mode to either "move" or "zoom" */

  // if this function as tried too many times, just stop it
  if (timesRepeated >= 10) {
    console.error("Could not change scrollMode");
    return;
  }

  // get the scroll mode setting <select> tag
  var dropdown = document.querySelector("#settings-scroll-mode");

  // if the dropdown doesn't exist yet, try again in 100ms
  if (!dropdown) {
    setTimeout(function() {
      changeMode(mode, timesRepeated + 1);
    }, 100);
    return;
  }

  // simulate a user clicking on the dropdown
  dropdown.dispatchEvent(new Event('click', {
    bubbles: true
  }));

  // change the selected index based on the choice
  if (mode == "zoom") {
    dropdown.selectedIndex = 0;

  } else if (mode == "move") {
    dropdown.selectedIndex = 1;

  } else {
    dropdown.selectedIndex = 2; // set it to do nothing
  }

  // trigger the `change` event to invoke any event listeners
  dropdown.dispatchEvent(new Event('change', {
    bubbles: true
  }));

  // remove the overlay now
  var overlay = findAncestorWithModalId(dropdown);
  overlay.remove();

}

function findAncestorWithModalId(element) {
  /* finds an ancestor of the specified element whose id contains "modal" */
  while (element) {
    if (element.id && element.id.includes("modal")) {
      return element;
    }
    element = element.parentElement; // Move up to the parent element
  }
  return null; // Return null if no matching ancestor is found
}

function addListeners(timesRepeated = 0) {
  /* adds the scroll and zoom listeners that will change modes when needed */

  if (timesRepeated >= 100) {
    console.error("Could not find the canvas to add event listeners to");
    return;
  }

  // find the canvas
  var canvas = document.querySelector('canvas.raster');
  if (!canvas) {
    setTimeout(function() {
      addListeners(timesRepeated + 1);
    }, 100);
    return;
  }

  // add an event listener
  canvas.addEventListener('wheel', (event) => {

    var settingsString = localStorage.getItem("user-settings");
    var settingsDict = JSON.parse(settingsString);
    var scrollMode = settingsDict["scrollMode"];

    if (event.ctrlKey) {
      console.log("zooming over canvas");
      if (scrollMode != "zoom") {
        openPreferencesPanel()
        changeMode("zoom");
      }

    } else {
      console.log("scrolling over canvas");
      if (scrollMode != "move") {
        openPreferencesPanel()
        changeMode("move");
      }

    }
  });

}

function openPreferencesPanel() {
  /* opens the preferences panel so the changeMode() function works */

  // get the preferences menu item
  var preferencesButton = document.querySelector("#edit-preferences");

  // simulate a user clicking on the preferencesButton
  preferencesButton.dispatchEvent(new Event('click', {
    bubbles: true
  }));
}

function main() {
  /* the main function */

  addListeners();
  return;

  openPreferencesPanel()

  changeMode("zoom");

}

main();