function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

getBrowser().runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log("received message", request)
    let [url, icon] = request;
    let bmk = (await getBrowser().bookmarks.search({url : url}));
    console.log(bmk)
    if (bmk && bmk.length > 0) {
        await getBrowser().storage.local.set({["icon-"+bmk[0].id]: icon});
    }
    sendResponse();
})
