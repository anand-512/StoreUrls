function addUrl(currentUrl) {
    return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage({
            action: "AddUrl",
            url: currentUrl
        },function(response){
            resolve(response.message);
        });
    })
}

function printMessage(message) {
    if(message) {
        console.log(message);
    }
}

function listenForMessage() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var promise = new Promise(function(resolve, reject) {
            if(request.action === 'IconClicked') {
                resolve(request);
            }
        });

        promise.then(onMessageReceived);
    });
}

function createDiv(divText) {
    var div = document.createElement('div');
    div.innerText = divText;
    div.style.textAlign = 'left';
    div.style.color = '#126cfa';
    div.style.margin = '5px';
    div.style.padding = '2px;'
    return div;
}

function appendDivInTab(div) {
    document.body.appendChild(div);
}

function onMessageReceived(request) {
    printMessage(request.localUrls);
    var div = createDiv(request.divText);
    appendDivInTab(div);
}

var currentUrl = document.location.href;

addUrl(currentUrl).then(printMessage);

listenForMessage();
