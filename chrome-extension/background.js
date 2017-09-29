
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !getState()
 // var key = "myKey",
 //     testPrefs = JSON.stringify({
 //         'val': 10
 //     });
 // var jsonfile = {};
 // jsonfile[key] = testPrefs;
 // chrome.storage.sync.set(jsonfile, function () {
 //     console.log('Saved', key, testPrefs);
 //  });
 // }

  if (toggle) {
    chrome.browserAction.setIcon({ path: "icons/on.png", tabId: tab.id });
    chrome.tabs.sendMessage(tab.id, { dark: true }, function(response) {
      // no-op
    });
  } else {
    chrome.browserAction.setIcon({ path: "icons/off.png", tabId: tab.id });
    chrome.tabs.sendMessage(tab.id, { dark: false }, function(response) {
      // no-op
    });
  }
  saveChanges(toggle);
});

chrome.tabs.onActivated.addListener(function(tab) {
  if (toggle) {
    chrome.browserAction.setIcon({ path: "icons/on.png", tabId: tab.id });
  } else {
    chrome.browserAction.setIcon({ path: "icons/off.png", tabId: tab.id });
  }
});

function getState() {
    chrome.storage.sync.get('dcos-dark-theme-state', function (obj) {
        // Initialize state if not initialized
	return obj;
    });
}

function saveChanges(toggleState) {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'dcos-dark-theme-state': toggleState}, function() {
    // Notify that we saved.
    message('Settings saved');
  });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
  });
      

$(function(){
    //default value is "start"
    var currentState = localStorage.currentState || "start";
    //cache button DOM element reference
    var $toggleBtn = $("#toggle-btn");

    //update button status
    if(currentState==="stop"){
        $toggleBtn.text("OFF");
    }

    //register button click handler
    $toggleBtn.click(function(){
        if(currentState==="start"){
            $toggleBtn.text("OFF");
            localStorage.currentState="stop";
        }
        if(currentState==="stop"){
            $toggleBtn.text("ON");
            localStorage.currentState="start";
        }
    });
});
