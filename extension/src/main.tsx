import { createRoot } from 'react-dom/client'
import './index.css'
import Folder from "./Folder.tsx";

// @ts-ignore
if (typeof browser === "undefined") {
    var browser = chrome;
}

browser.bookmarks.getTree().then(tree => {
    createRoot(document.getElementById('root')!).render(
        // @ts-ignore
        <Folder data={tree[0].children[0]} />
    )
});

// chrome.bookmarks.create(
//     {'parentId': '0', 'title': 'Bookmarks Extension'},
//     function (newFolder) {
//         console.log("added folder: " + newFolder.title);
//     },
// );