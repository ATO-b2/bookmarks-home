import React, {useEffect, useState} from "react";
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
    const [rootFolder, setRootFolder] = useState('1');
    const [bookmarkTree, setBookmarkTree] = useState<BookmarkTreeNode[]>([])
    const [ogBookmarkTree, setOgBookmarkTree] = useState<BookmarkTreeNode[] | null>([])
    const [backgroundURL, setBackgroundURL] = useState("")
    useEffect(() => {
        browser.bookmarks.getTree().then(t => {
            setOgBookmarkTree(t);
        })
    }, [])
    useEffect(() => {
        browser.bookmarks.getSubTree(rootFolder).then(t => {
            setBookmarkTree(t);
        });
    }, [rootFolder]);

    return (
        <BookmarkTree.Provider value={{bookmarkTree, setBookmarkTree}}>
        <RootFolder.Provider value={{rootFolder, setRootFolder}}>
            <style>{"body {background-image: url(\""+ backgroundURL +"\")}"}</style>
            <button id="settings-button" onClick={_ => setSettingsOpen(!settingsOpen)}>
                <img alt="open settings" src={imageUrl}/>
            </button>
            {settingsOpen && (<SettingsEditor tree={ogBookmarkTree!} closer={setSettingsOpen} setBackgroundURL={setBackgroundURL}/>)}
            {bookmarkTree[0] && (<Folder data={bookmarkTree[0]}/>)}
        </RootFolder.Provider>
        </BookmarkTree.Provider>
    )
}

export default Body