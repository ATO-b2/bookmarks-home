import React, {useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import Folder from "./Folder.tsx";
import imageUrl from "./assets/settings.svg"
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

function Body(props: {tree: BookmarkTreeNode[]}) {
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <>
            <button id="settings-button" onClick={_ => setSettingsOpen(!settingsOpen)}>
                <img alt="open settings" src={imageUrl}/>
            </button>
            {settingsOpen && (<SettingsEditor closer={setSettingsOpen}/>)}
            <Folder data={
                (props.tree && props.tree[0] && props.tree[0].children && props.tree[0].children[0])!
            }/>
        </>
    )
}

export default Body