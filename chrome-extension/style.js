var toggleState = false;
var storageKey = "dcos-dark-theme-state";
var isDCOS = false;
var oReq = new XMLHttpRequest();

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
  if (!isDCOS || !document.body) {
    removeStylesFromPage();  
    return;
  }

  if (toggleState) {
    addStylesOnPage();
    return;
  }

  removeStylesFromPage();
};

var changeIcons = function() {
  if (toggleState) {
      // add inverse
      Array.prototype.slice.call(document.getElementsByTagName("use")).forEach(function(use) {
          if (use.href.baseVal.indexOf("inverse") === -1 && use.href.baseVal.indexOf("product") > -1) {
              use.href.baseVal += "-inverse";
          }
      });
      return;
  }

  Array.prototype.slice.call(document.getElementsByTagName("use")).forEach(function(use) {
    if (use.href.baseVal.indexOf("inverse") > -1 && use.href.baseVal.indexOf("product") > -1) {
        if (use.parentNode.parentNode.nodeName === "A") {
            return;
        }
        use.href.baseVal = use.href.baseVal.replace(/-inverse/g, "");
    }
  });
};

var addStylesOnPage = function() {
  if (!isDCOS || !toggleState) {
    removeStylesFromPage(); 
    return;
  }
  var overrideSheet = document.getElementById(storageKey);
  if (overrideSheet) {
    return;
  }
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

function dcosStateLoaded() {
  if(!isDCOS){
    return;
  }

  setInterval(function(){
    changeIcons();
  }, 100);

  chrome.storage.sync.get(storageKey, function(obj) {
    toggleState = obj[storageKey];
    refreshStyles();
  });

  refreshStyles();
}

function dcosMetadataListener() {
  try{
    var dcosMetadata = JSON.parse(this.responseText);
    if (!dcosMetadata || !this.responseText.includes("dcos-image-commit")) {
      isDCOS = false;
    }else{
      isDCOS = true;
    }
  }catch(ex){
    isDCOS = false;
  }
  dcosStateLoaded();
}

setTimeout(function(){
  if(document && document.title && document.title.includes("DC/OS")) {
    oReq.addEventListener("load", dcosMetadataListener);
    oReq.open("GET", "/dcos-metadata/dcos-version.json");
    oReq.send();
  }
}, 0);
