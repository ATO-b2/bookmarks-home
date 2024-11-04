import React, {useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import Folder from "./Folder.tsx";
import imageUrl from "./assets/settings.svg"
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

// @ts-ignore
if (typeof browser === "undefined") {
    var browser = chrome;
}

export const RootFolder = React.createContext({
    rootFolder: '0',
    setRootFolder: (arg0: string) => {}
});

export const BookmarkTree = React.createContext({
    bookmarkTree: [] as BookmarkTreeNode[],
    setBookmarkTree: (arg0: BookmarkTreeNode[]) => {}
})

function Body() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [rootFolder, setRootFolder] = useState('1')
    const [bookmarkTree, setBookmarkTree] = useState<BookmarkTreeNode[]>([])
    const [ogBookmarkTree, setOgBookmarkTree] = useState<BookmarkTreeNode[] | null>([])

    browser.bookmarks.getSubTree(rootFolder).then(t => {
        console.log(t);
        if (t != bookmarkTree) {
            setBookmarkTree(t);
        }
        console.log(bookmarkTree == t)
    });

    if (ogBookmarkTree?.length == 0) {
        browser.bookmarks.getTree().then(t => {
            setOgBookmarkTree(t);
        })
    }

    return (
        <BookmarkTree.Provider value={{bookmarkTree, setBookmarkTree}}>
        <RootFolder.Provider value={{rootFolder, setRootFolder}}>
            <button id="settings-button" onClick={_ => setSettingsOpen(!settingsOpen)}>
                <img alt="open settings" src={imageUrl}/>
            </button>
            {settingsOpen && (<SettingsEditor tree={ogBookmarkTree!} closer={setSettingsOpen}/>)}
            {bookmarkTree[0] && (<Folder data={bookmarkTree[0]}/>)}
        </RootFolder.Provider>
        </BookmarkTree.Provider>
    )
}

export default Body