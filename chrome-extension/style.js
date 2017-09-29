// insert our override styles
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('styles/dist/styles.css');
(document.head||document.documentElement).appendChild(style);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.dark) {
        document.body.className = "dark";
    } else {
        document.body.className = "";
    }
});