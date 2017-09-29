var toggleState = false;
var storageKey = "dcos-dark-theme-state";
var loadingCounter = 0;

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    if (key === storageKey) {
      toggleState = storageChange.newValue;
      refreshStyles();
      break;
    }
  }
});

var refreshStyles = function() {
  if (!document.querySelector("#" + storageKey)) {
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
  style.id = storageKey;
  style.href = chrome.extension.getURL("styles/dist/styles.css");
  (document.head || document.documentElement).appendChild(style);
};

var firstStateInterval = setInterval(function() {
  chrome.storage.sync.get(storageKey, function(obj) {
    refreshStyles();
    toggleState = obj[storageKey];
    if (loadingCounter >= 10) {
      clearInterval(firstStateInterval);
    }
    console.log(loadingCounter);
    if (
      document.querySelector(
        "[style='height: 0px; overflow: hidden; width: 0px; visibility: hidden;']"
      )
    ) {
      loadingCounter++;
    }
  });
}, 10);
