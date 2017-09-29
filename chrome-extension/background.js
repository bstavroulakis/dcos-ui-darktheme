var toggleState = false;
var storageKey = "dcos-dark-theme-state";

chrome.storage.sync.get(storageKey, function(obj) {
  toggleState = obj[storageKey];
  refreshIcon();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    if (key === storageKey) {
      toggleState = storageChange.newValue;
      refreshIcon();
      break;
    }
  }
});

var refreshIcon = function() {
  var image = toggleState ? "on" : "off";
  chrome.browserAction.setIcon({ path: "icons/" + image + ".png" });
};

chrome.browserAction.onClicked.addListener(function(tab) {
  var toggle = !toggleState;
  chrome.storage.sync.set({ [storageKey]: toggle });
});
