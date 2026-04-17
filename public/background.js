function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

getBrowser().runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    let {siteUrl, foundIcons} = request;
    console.debug("request received:", request)

    // TODO make this match any bookmark with the subdomain
    let bmk = (await getBrowser().bookmarks.search({url: siteUrl})).at(0)
    if (bmk) {
        const obj = { [`icon-aval-${bmk.id}`]: JSON.stringify(foundIcons) };

        await getBrowser().storage.local.set(obj);
        console.debug("set to storage:", obj);
    }

    sendResponse();
})
