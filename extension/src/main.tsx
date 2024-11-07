import { createRoot } from 'react-dom/client'
import './index.css'
import Body from "./components/Body.tsx";

export function getBrowser() {
    if (typeof browser === "undefined") {
        return chrome;
    } else {
        return browser;
    }
}

createRoot(document.body).render(<Body/>)

// chrome.bookmarks.create(
//     {'parentId': '0', 'title': 'Bookmarks Extension'},
//     function (newFolder) {
//         console.log("added folder: " + newFolder.title);
//     },
// );