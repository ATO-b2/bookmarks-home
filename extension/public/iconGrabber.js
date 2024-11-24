const tagTypes = ["apple-touch-icon", "shortcut icon", "icon"]

let x = Array.from(document.getElementsByTagName("link"))
    .filter(elem => tagTypes.includes(elem.rel))
    .sort((a, b) => {
        let tagCompare = tagTypes.indexOf(a.rel) - tagTypes.indexOf(b.rel);
        if (tagCompare !== 0) return tagCompare;
        try { return Number(b.sizes[0].split('x')[0]) - Number(a.sizes[0].split('x')[0]); }
        catch { return -1; }
    })
    .map(elem => elem.href);

chrome.runtime.sendMessage([window.location.href, x[0]]).catch(() => {
    console.log("failed to send message")
})