import { createRoot } from 'react-dom/client'
import './index.css'
import Body from "./components/Body.tsx";

export function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}
//
// getBrowser().runtime.onMessage.addListener((message) => {
//     console.log(message);
//     if (message[0] === "icon") {
//         getBrowser().bookmarks.search({url : message[1]}).then(r => {
//             getBrowser().storage.local.set({["icon-"+r[0].id] : message[2]});
//         })
//     }
// })

createRoot(document.body).render(<Body/>)

// chrome.bookmarks.create(
//     {'parentId': '0', 'title': 'Bookmarks Extension'},
//     function (newFolder) {
//         console.log("added folder: " + newFolder.title);
//     },
// );