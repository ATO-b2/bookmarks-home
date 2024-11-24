chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log("received message", request)
    let [url, icon] = request;
    let bmk = (await chrome.bookmarks.search({url : url}));
    console.log(bmk)
    if (bmk && bmk.length > 0) {
        await chrome.storage.local.set({["icon-"+bmk[0].id]: icon});
    }
    sendResponse();
})
