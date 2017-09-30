var toggleState = false;
var storageKey = "dcos-dark-theme-state";
var loadingCounter = 0;
var isDCOS = false;
var dcosVersion = 0;

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    if (key === storageKey && isDCOS) {
      toggleState = storageChange.newValue;
      refreshStyles();
      break;
    }
  }
});

var refreshStyles = function() {
  if (!isDCOS) {
    return;
  }

  if (!document.body) {
    return;
  }

  if (toggleState) {
    addStylesOnPage();
  } else {
    removeStylesFromPage();    
  }
};

var changeIcons = function() {
    if (toggleState) {
        // add inverse
        Array.prototype.slice.call(document.getElementsByTagName("use")).forEach(function(use) {
            if (use.href.baseVal.indexOf("inverse") === -1 && use.href.baseVal.indexOf("product") > -1) {
                use.href.baseVal += "-inverse";
            }
        });
    } else {
        // remove inverse
        Array.prototype.slice.call(document.getElementsByTagName("use")).forEach(function(use) {
            if (use.href.baseVal.indexOf("inverse") > -1 && use.href.baseVal.indexOf("product") > -1) {
                if (use.parentNode.parentNode.nodeName === "A") {
                    return;
                }
                use.href.baseVal = use.href.baseVal.replace(/-inverse/g, "");
            }
        });
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

var removeStylesFromPage = function() {
    var overrideSheet = document.getElementById(storageKey);
    if (overrideSheet) {
        overrideSheet.parentNode.removeChild(overrideSheet);        
    }
};

var firstStateInterval = setInterval(function() {
  chrome.storage.sync.get(storageKey, function(obj) {
    refreshStyles();
    toggleState = obj[storageKey];
    if (loadingCounter >= 10) {
      clearInterval(firstStateInterval);
    }
    if (document.querySelector("#application")) {
      loadingCounter++;
    }
  });
}, 10);

var iconInterval = setInterval(function() {
    changeIcons();
}, 10);

function reqListener() {
  var dcosMetadata = JSON.parse(this.responseText);
  dcosVersion = dcosMetadata.version;
  isDCOS = true;
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "/dcos-metadata/dcos-version.json");
oReq.ondata = function() {};
oReq.send();
