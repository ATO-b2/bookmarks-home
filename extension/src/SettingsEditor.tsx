import RadioButtonGroup from "./RadioButtonGroup.tsx";
import React, {useContext} from "react";
import imageUrl from "./assets/close.svg"
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {Settings} from "./Body.tsx";

function SettingsEditor(props: {tree: BookmarkTreeNode[], isOpen: [boolean,  React.Dispatch<React.SetStateAction<boolean>>]}) {
    const [settings, setSettings] = useContext(Settings)
    const [open, setOpen] = props.isOpen;

    return (
        <div id="settings-menu" className={open? "open": "closed"}>
            <button id="settings-close" onClick={_ => setOpen(false)}>
                <img alt="close settings" src={imageUrl}/>
            </button>
            <h1>Settings</h1>

            <h3>Sort</h3>
            <RadioButtonGroup defaultValue={settings.sort}
                              onChange={e => {setSettings({...settings, sort: e})}}>
                <option value={"from-bookmarks"}>From Bookmarks</option>
                <option value={"alphabetical"}>Alphabetical</option>
                <option value={"frequency"}>Frequency</option>
                <option value={"recent"}>Recently used</option>
            </RadioButtonGroup>
            <br/>
            <label>
                <input type={"checkbox"}
                       checked={settings.foldersFirst}
                       onChange={e => setSettings({...settings, foldersFirst: e.target.checked})}/>
                Sort Folders First
            </label>

            <h3>Background Type</h3>
            <RadioButtonGroup defaultValue={settings.backgroundMode}
                              onChange={e => setSettings({...settings, backgroundMode: e})}>
                <option value={"theme"}>Default</option>
                <option value={"color"}>Solid Color</option>
                <option value={"image"}>Image</option>
            </RadioButtonGroup>

            {(() => { switch (settings.backgroundMode) {
                case "image": return (<>
                    <h3>Background Image URL</h3>
                    <input type={"url"}
                           defaultValue={settings.backgroundImage}
                           onChange={e => setSettings({...settings, backgroundImage: e.target.value})}/>
                </>)
                case "color": return (<>
                    <h3>Background Color</h3>
                    <input type={"color"}
                           defaultValue={settings.backgroundColor}
                           onChange={e => setSettings({...settings, backgroundColor: e.target.value})}/>
                </>)
            }})()}

            <h3>Edit mode</h3>
            <label>
                <input type={"checkbox"}/>
                Enable Edit mode
            </label>

            <h3>Root folder</h3>
            <select defaultValue={settings.rootFolder!}
                    onChange={e => setSettings({...settings, rootFolder: e.target.value})}>
                {getFoldersFromTree(props.tree).map(i =>
                    <option value={i.id}>{i.title ? i.title : "Untitled (id:" + i.id + ")"}</option>
                )}
            </select>

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