let settings: { [p: string]: any } = {
    sort: "from-bookmarks",
    backgroundMode: "from-theme",
    backgroundColor: "#000000",
    rootFolderID: 0,
}

function loadSettings() {
    browser.storage.local.set(settings);
}

function writeSettings() {
    browser.storage.local.get(settings).then(r => {
        settings = r;
    })
}

