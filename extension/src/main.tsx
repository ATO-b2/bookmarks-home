import { createRoot } from 'react-dom/client'
import './index.css'
import Body from "./Body.tsx";

// @ts-ignore
if (typeof browser === "undefined") {
    var browser = chrome;
}

createRoot(document.body).render(<Body/>)

// chrome.bookmarks.create(
//     {'parentId': '0', 'title': 'Bookmarks Extension'},
//     function (newFolder) {
//         console.log("added folder: " + newFolder.title);
//     },
// );