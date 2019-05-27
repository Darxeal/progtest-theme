let theme, dropdown

chrome.runtime.sendMessage({ type: "config" }, function (response) {
    theme = response.theme
    dropdown = response.dropdown
    
    if (response.theme == 'orig')
        return

    var favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = chrome.extension.getURL('./themes/assets/favicon.ico');
    document.getElementsByTagName('head')[0].appendChild(favicon);
    document.title = document.title.replace("@progtest.fit.cvut.cz -", " |").replace("progtest.fit.cvut.cz - ", "")
})

function toggleDropDown(e) {
    if (e.button == 2)
        return
    if (e.target.nodeName == "A" || e.target.nodeName == "BUTTON")
        return
    let id = 0
    for (let node of e.currentTarget.parentNode.children) {
        if (id++ == 0)
            continue
        if (node.className.indexOf("dropDownHide") == -1)
            node.className += " dropDownHide"
        else
            node.className = node.className.replace(" dropDownHide", "")
    }
}

function screenShot()
{
    chrome.runtime.sendMessage({
        type: 'include',
        file: 'zip.js',
    }, result => {
        if (typeof model == "undefined") {
            console.log("Zip lib didn't load")
            return
        }

        // add files
        document.body.innerHTML += "<canvas id='canvas1' width='500' height='500'></canvas>";
        var can = document.getElementById('canvas1');
        var ctx = can.getContext('2d');

        ctx.fillRect(50,50,50,50);

        var reader  = new FileReader();

        reader.onloadend = function () {
            model.addFile(reader.result);
            console.log(reader.result);

            model.getBlobURL(function(blobURL) {
                console.log(blobURL)
                chrome.runtime.sendMessage({ type: "download", url: blobURL }, e => {
                    if (e.status != 'ok')
                        console.log(e.status)
                })
            });
        }
        reader.readAsDataURL(can.toDataURL());
    })
    
/*
    chrome.runtime.sendMessage({ type: "download", url: can.toDataURL() }, e => {
        if (e.status != 'ok')
            console.log(e.status)
    })
    */
}
/*
function scriptLoader(scripts, callback) {
    var count = scripts.length;
    function urlCallback(url) {
        return function () {
            console.log(url + ' was loaded (' + --count + ' more scripts remaining).');
            if (count < 1)
                callback();
        };
    }
    function loadScript(url) {
        var s = document.createElement('script');
        s.setAttribute('src', url);
        s.onload = urlCallback(url);
        document.head.appendChild(s);
    }

    for (var script of scripts)
        loadScript(script);
};
*/