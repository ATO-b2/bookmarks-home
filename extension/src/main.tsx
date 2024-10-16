import { createRoot } from 'react-dom/client'
import './index.css'
import Folder from "./Folder.tsx";

chrome.bookmarks.getTree(tree => {
    createRoot(document.getElementById('root')!).render(
        <Folder data={tree[0]} />
    )
});

// chrome.bookmarks.create(
//     {'parentId': '0', 'title': 'Bookmarks Extension'},
//     function (newFolder) {
//         console.log("added folder: " + newFolder.title);
//     },
// );