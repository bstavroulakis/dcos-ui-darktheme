// insert our override styles
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('styles/dist/styles.css');
(document.head||document.documentElement).appendChild(style);

document.body.className += "dark";