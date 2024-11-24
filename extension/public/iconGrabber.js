function getBrowser() {
    if (typeof browser === "undefined") {
        return chrome;
    } else {
        return browser;
    }
}

const tagTypes = ["apple-touch-icon", "shortcut icon", "icon"]

let x = Array.from(document.getElementsByTagName("link"))
    .filter(elem => tagTypes.includes(elem.rel))
    .sort((a, b) => {
        function compareTags() {
            return tagTypes.indexOf(a.rel) - tagTypes.indexOf(b.rel);
        }
        function compareSizes() {
            try { return Number(b.sizes[0].split('x')[0]) - Number(a.sizes[0].split('x')[0]); }
            catch { return -1; }
        }

        return compareSizes() || compareTags()
    });

console.log("found icons", x.map(elem => elem.outerHTML));
x = x.map(elem => elem.href);

getBrowser().runtime.sendMessage([window.location.href, x[0]]).catch(() => {
    console.log("failed to send message")
})