import { createRoot } from 'react-dom/client'
import './index.css'
import Folder from "./Folder.tsx";
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
import Bookmark from "./Bookmark.tsx";

chrome.bookmarks.getTree((tree) => {
    createRoot(document.getElementById('root')!).render(createFolder(tree[0]))
});

function createFolder(lev: BookmarkTreeNode) {
    return (
        <Folder name={lev.title}>
            {
                lev.children ? lev.children.map(item => {
                    if (item.children) {
                        return createFolder(item)
                    } else {
                        return <Bookmark name={item.title} url={item.url ? item.url : ""} icon={faviconURL(item.url)} />
                    }
                }) : <span>err</span>
            }
        </Folder>
    )
}

function faviconURL(u: string | undefined) {
    if (!u) {
        return "";
    }
    u = new URL(u).origin.toString();
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    console.log(u)
    return url.toString();
}


// chrome.bookmarks.create(
//     {'parentId': '0', 'title': 'Bookmarks Extension'},
//     function (newFolder) {
//         console.log("added folder: " + newFolder.title);
//     },
// );