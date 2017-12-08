function listenForIconClick(localUrls) {
    chrome.browserAction.onClicked.addListener(function (tab) {
        onIconClick(localUrls);
    });
}


function getFromLocalStorage(key) {
    var value = JSON.parse(localStorage.getItem(key));
    if(value === null) {
        value = [];
    }
    return value;
}

function printMessage(message) {
    if(message) {
        console.log(message);
    }
}

function onIconClick(localUrls) {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "IconClicked", localUrls: localUrls, divText: "Icon Clicked"});
        });
    });
}

function writeToLocalStorage(data) {
    return new Promise(function (resolve, reject) {
        localStorage.setItem(data.key, JSON.stringify(data.value));
        resolve(data.sendResponse);
    });
}


function sendMessageReceivedAck(sendResponse) {
    sendResponse({message: "Url has been added successfully"});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.action == "AddUrl") {
        var promise = new Promise(function (resolve, reject) {
            printMessage(request.url);
            localUrls.push(request.url);
            var data = {
                key: "localUrls",
                value: localUrls,
                sendResponse: sendResponse
            };
            resolve(data);
        });

        promise.then(writeToLocalStorage).then(sendMessageReceivedAck);
        return true;
    }
});

var localUrls = getFromLocalStorage('localUrls');

listenForIconClick(localUrls);
