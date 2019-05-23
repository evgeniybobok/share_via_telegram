//Set text shown on hover over icon
chrome.browserAction.setTitle({
    title:'Share Page via Telegram'
});

//this is for when the icon is clicked
chrome.browserAction.onClicked.addListener(function(tab){
    shareMessage(tab.index, tab.url, tab.title, tab.id);
});

//Main fuction to share to native Telegram client
function shareMessage(index,url,tagText,tabid) {
var openurl = "tg://msg_url?url="+encodeURIComponent(url)+"&text="+encodeURIComponent(tagText);
var newindex = index+1;
    chrome.tabs.create({'url': openurl, 'index': newindex},  function(tab){
        setTimeout(function(){
            chrome.tabs.remove(tab.id);
            chrome.tabs.update(tabid, {active: true})
        }, 2000);
   });
}

//Since the page is non persistant, add a listener at install time to create the context menu
chrome.runtime.onInstalled.addListener(function() {
    //Create context for page and frame
    chrome.contextMenus.create({
        title: 'Share Page via Telegram',
        id: 'share-page',
        contexts: ["page","frame"],
    });

    //Create context for links
    chrome.contextMenus.create({
        title: 'Share Link via Telegram',
        id: 'share-link',
        contexts: ["link"],
    });

    //Create context for media
    chrome.contextMenus.create({
        title: 'Share Image via Telegram',
        id: 'share-media',
        contexts: ["image"],
    });
        //Create context for selected text
    chrome.contextMenus.create({
        title: 'Share Text via Telegram',
        id: 'share-selection',
        contexts: ["selection"],
    });

});

//onClick listener for each type of context menu
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    var data = "";
    switch (info.menuItemId) {
        case "share-page":
            data = info.pageUrl;
            var tagText = tab.title;
            break;

        case "share-link":
            data = info.linkUrl;
            if (info.hasOwnProperty("selectionText")){
                var tagText = info.selectionText;
            }
            else{
                var tagText = "Sent by Share via Telegram https://goo.gl/s8HhNi";
            }

            break;

        case "share-media":
            data = info.srcUrl;
            var tagText = "Sent by Share via Telegram https://goo.gl/s8HhNi";
            break;

        case "share-selection":
            data = info.pageUrl;
            tagText = "\""+info.selectionText+"\"";
            break;


    }

    shareMessage(tab.index, data, tagText, tab.id);
});