var toggle = false;
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if (toggle) {
    chrome.browserAction.setIcon({ path: "on.png", tabId: tab.id });
    // chrome.tabs.executeScript(tab.id, {file:"SCRIPT.user.js"});
    chrome.tabs.executeScript(tab.id, { file: "style.js" });
  } else {
    chrome.browserAction.setIcon({ path: "off.png", tabId: tab.id });
    chrome.tabs.executeScript(tab.id, { file: "style.js" });
  }
});
