function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

function toDataURL(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))
}

getBrowser().runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log("received message", request)
    let [url, icon] = request;

    let bmk = (await getBrowser().bookmarks.search({url : url}));
    console.log(bmk)
    if (bmk && bmk.length > 0) {
        let imgData = await toDataURL(icon)
        // console.log(imgData)
        await getBrowser().storage.local.set({["icon-cache-"+bmk[0].id]: imgData});
    }
    sendResponse();
})
