var toggle = false;
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if (toggle) {
    chrome.browserAction.setIcon({ path: "icons/on.png", tabId: tab.id });
  } else {
    chrome.browserAction.setIcon({ path: "icons/off.png", tabId: tab.id });
  }
});

chrome.tabs.onActivated.addListener(function(tab) {
  if (toggle) {
    chrome.browserAction.setIcon({ path: "icons/on.png", tabId: tab.id });
  } else {
    chrome.browserAction.setIcon({ path: "icons/off.png", tabId: tab.id });
  }
});
