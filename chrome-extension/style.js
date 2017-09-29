var toggleState = false;
var storageKey = "dcos-dark-theme-state";

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    if (key === storageKey) {
      if (toggleState !== storageChange.newValue) {
        refreshStyles();
      }
      toggleState = storageChange.newValue;
      break;
    }
  }
});

var refreshStyles = function() {
  if (!document.querySelector("#dcos-dark-style")) {
    addStylesOnPage();
  }
  if (toggleState) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};

var addStylesOnPage = function() {
  var style = document.createElement("link");
  style.rel = "stylesheet";
  style.type = "text/css";
  style.id = "dcos-dark-style";
  style.href = chrome.extension.getURL("styles/dist/styles.css");
  (document.head || document.documentElement).appendChild(style);
};

document.addEventListener("DOMContentLoaded", function(event) {
  chrome.storage.sync.get(storageKey, function(obj) {
    toggleState = obj[storageKey];
    console.log(toggleState);
    refreshStyles();
  });
});
