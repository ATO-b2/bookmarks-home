function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

const tagTypes = ["apple-touch-icon", "shortcut icon", "icon"]

function getImageDimensions(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({width: img.naturalWidth, height: img.naturalHeight});
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}

async function getBookmarkData() {
    return (await Promise.all(
        Array.from(document.getElementsByTagName("link"))
            .filter(elem => elem.rel && tagTypes.includes(elem.rel))
            .map(async elem => {
                try {
                    const { width } = await getImageDimensions(elem.href);
                    return {
                        url: elem.href,
                        tagPriority: tagTypes.indexOf(elem.rel),
                        size: elem.type === "image/svg+xml" ? Infinity : width,
                    };
                } catch {
                    console.debug("[bookmarks-home] error on:", elem.href)
                    return null;
                }
            })
    ))
        .filter(Boolean)
        .sort((a, b) => b.size - a.size || a.tagPriority - b.tagPriority)
        .map(({ tagPriority: _, ...rest }) => rest);
}

getBookmarkData().then(r => {
    console.debug('[bookmarks-home] found icons:', r);
    getBrowser().runtime.sendMessage({
        siteUrl: window.location.href,
        foundIcons: r
    });
})
