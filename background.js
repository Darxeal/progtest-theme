
var theme = 'light';
var dropdown = true

chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.sync.get({
        selectedTheme: 'light',
        autoHide: true
    }, (items) => {
        theme = items.selectedTheme;
        dropdown = items.autoHide;
    })
})

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.type == "config")
            sendResponse({ theme: theme, dropdown: dropdown })
        else if (request.type == "download") {
            //if (request.url.substring(0, 15) == "data:image/png;") {
                chrome.downloads.download({
                    url: request.url,
                    saveAs: true
                })
                sendResponse({ status: 'ok' })
            //} else
            //    sendResponse({ status: 'wrong URL type' })
        } else if (request.type == "include") {
            chrome.tabs.executeScript(null, {file: './vendor/' + request.file}, result => {
                sendResponse(result)
            })
        }
    })

chrome.storage.onChanged.addListener(
    () => {
        chrome.storage.sync.get({
            selectedTheme: 'light',
            autoHide: true
        }, (items) => {
            theme = items.selectedTheme;
            dropdown = items.autoHide;
        })
    }
)

chrome.webRequest.onBeforeRequest.addListener(
    () => {
        if (theme == 'orig')
            return { cancel: false };
        return { redirectUrl: chrome.runtime.getURL('themes/' + theme + '.css') };
    },
    { urls: ["*://progtest.fit.cvut.cz/css.css"] },
    ["blocking"]
)
