chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action == 'run')
        chrome.tabs.executeScript(sender.tab.id, {file: 'content/remove.js', allFrames: false});
    
    if (message.action == 'close')
        chrome.tabs.remove(sender.tab.id);
});

/*
var op = {};
chrome.storage.onChanged.addListener( (changes, namespace) => {
    chrome.storage.local.get(null, (data) =>  {
        op = data;
    });
});
*/