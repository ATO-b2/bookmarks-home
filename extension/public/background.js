function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

// function toDataURL(url) {
//     return fetch(url)
//         .then(response => response.blob())
//         .then(blob => new Promise((resolve, reject) => {
//             const reader = new FileReader()
//             reader.onloadend = () => resolve(reader.result)
//             reader.onerror = reject
//             reader.readAsDataURL(blob)
//         }))
// }
//
// async function getDocument(url) {
//     let res = await fetch(url)
//     let html = await res.text();

    // console.log("html", url);
    // await chrome.offscreen.createDocument({
    //     url: url,
    //     reasons: ["DOM_SCRAPING"],
    //     justification: "locating highest quality icons"
    // })
// }

// function getGoogleFavicons(u) {
//     const url = new URL('https://www.google.com/s2/favicons');
//     url.searchParams.set("sz", "256");
//     url.searchParams.set("domain_url", u);
//     return url.toString();
// }

// function getIcons(doc) {
//     const tagTypes = ["apple-touch-icon", "shortcut icon", "icon"]
//
//     return Array.from(doc.getElementsByTagName("link"))
//         .filter(elem => tagTypes.includes(elem.rel))
//         .sort((a, b) => {
//             function compareTags() {
//                 // ascending
//                 return tagTypes.indexOf(a.rel) - tagTypes.indexOf(b.rel);
//             }
//             function compareSizes() {
//                 function getSize(elem) {
//                     try { return Number(elem.sizes[0].split('x')[0]); }
//                     catch { return 0; }
//                 }
//                 // descending
//                 return getSize(b) - getSize(a);
//             }
//
//             return compareSizes() || compareTags()
//         })
//         .map(elem => elem.href);
// }

getBrowser().runtime.onMessage.addListener((request, sender, sendResponse) => {
    // let url = request;
    //
    // let doc = await getDocument(url);
    // let icons = getIcons(doc);
    // if (icons.length <= 0) return;
    // console.log(icons[0])
    // let imgData = await toDataURL(icons[0]);
    // await getBrowser().storage.local.set({["icon-cache-"+bmk[0].id]: imgData});
    fetch(request).then(r1 => {
        r1.text().then(r2 => {
            sendResponse(r2)
        }).catch(ex => console.log("Failed to get text", request, ex))
    }).catch(ex => console.log("Failed to fetch", request, ex))
    return true;
})
