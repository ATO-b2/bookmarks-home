function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

const tagTypes = ["apple-touch-icon", "shortcut icon", "icon"]

let x = Array.from(document.getElementsByTagName("link"))
    .filter(elem => tagTypes.includes(elem.rel))
    .sort((a, b) => {
        function compareTags() {
            // ascending
            return tagTypes.indexOf(a.rel) - tagTypes.indexOf(b.rel);
        }
        function compareSizes() {
            function getSize(elem) {
                try { return Number(elem.sizes[0].split('x')[0]); }
                catch { return 0; }
            }
            // descending
            return getSize(b) - getSize(a);
        }

        return compareSizes() || compareTags()
    });

console.log("found icons", x.map(elem => elem.outerHTML));
x = x.map(elem => elem.href);

getBrowser().runtime.sendMessage([window.location.href, x[0]]).catch(() => {
    console.log("failed to send message")
})