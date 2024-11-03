import RadioButtonGroup from "./RadioButtonGroup.tsx";
import React, {useState} from "react";
import imageUrl from "./assets/close.svg"
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

function SettingsEditor(props: {tree: BookmarkTreeNode[], closer: (arg0: boolean) => void}) {
    const [backgroundType, setBackgroundType] = useState("fromTheme");
    const [sort, setSort] = useState("fromBookmarks");
    const [rootFolder, setRootFolder] = useState('0');

    return (
        <div id="settings-menu">
            <button id="settings-close" onClick={_ => props.closer(false)}>
                <img alt="close settings" src={imageUrl}/>
            </button>
            <h1>Settings</h1>

            <h3>Sort</h3>
            <RadioButtonGroup defaultValue={sort} onChange={e => setSort(e)}>
                <option value={"fromBookmarks"}>From Bookmarks</option>
                <option value={"alphabetical"}>Alphabetical</option>
                <option value={"frequency"}>Frequency</option>
                <option value={"recent"}>Recently used</option>
            </RadioButtonGroup>
            <label>
                <input type={"checkbox"}/>
                Sort Folders First
            </label>

            <h3>Background Type</h3>
            <RadioButtonGroup defaultValue={backgroundType} onChange={e => setBackgroundType(e)}>
                <option value={"fromTheme"}>From Theme</option>
                <option value={"solidColor"}>Solid Color</option>
                <option value={"image"}>Image</option>
            </RadioButtonGroup>

            <h3>Edit mode</h3>
            <label>
                <input type={"checkbox"}/>
                Enable Edit mode
            </label>

            <h3>Root folder</h3>
            <select defaultValue={rootFolder} onChange={e => setRootFolder(e.target.value)}>
                {getFoldersFromTree(props.tree).map(i =>
                    <option value={i.id}>{i.title ? i.title : "Untitled (id:"+i.id+")"}</option>
                )}
            </select>

            <br/>
            <span>value of bg type: {backgroundType}</span>
            <span>value of sort: {sort}</span>
            <span>value of root folder: {rootFolder}</span>
            <button>Save</button>
        </div>
    )
}

function getFoldersFromTree(tree: BookmarkTreeNode[]) {
    let folderList: BookmarkTreeNode[] = [];
    rec(tree);
    function rec(tree: BookmarkTreeNode[]) {
        tree.forEach(item => {
            if (item.children) {
                folderList.push(item);
                rec(item.children);
            }
        })
    }
    return folderList;
}

export default SettingsEditor;