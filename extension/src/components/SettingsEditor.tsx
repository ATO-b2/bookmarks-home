import RadioButtonGroup from "./RadioButtonGroup.tsx";
import React, {useContext} from "react";
import CloseIcon from "../assets/close.svg?react"
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {Settings} from "./Body.tsx";
import {getBrowser} from "../main.tsx";

/**
 * A component for the settings sidebar
 *
 * @param props.tree The full bookmarks tree (for use in the root selector)
 * @param props.isOpen State for weather the menu is open
 */
function SettingsEditor(props: {tree: BookmarkTreeNode[], isOpen: [boolean,  React.Dispatch<React.SetStateAction<boolean>>]}) {
    const [settings, setSettings] = useContext(Settings)
    const [open, setOpen] = props.isOpen;

    return (
        <div id="settings-menu" className={open ? "open" : "closed"}>
            <button id="settings-close" onClick={_ => setOpen(false)}>
                <CloseIcon/>
            </button>
            <h1>Settings</h1>

            <h3>Sort</h3>
            <RadioButtonGroup value={settings.sort}
                              onChange={e => {
                                  setSettings({...settings, sort: e})
                              }}>
                <option value={"from-bookmarks"}>From Bookmarks</option>
                <option value={"alphabetical"}>Alphabetical</option>
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
            <RadioButtonGroup value={settings.backgroundMode}
                              onChange={e => setSettings({...settings, backgroundMode: e})}>
                <option value={"theme"}>Default</option>
                <option value={"color"}>Solid Color</option>
                <option value={"image"}>Image</option>
            </RadioButtonGroup>

            {(() => {
                switch (settings.backgroundMode) {
                    case "image":
                        return (<>
                            <h3>Background Image URL</h3>
                            <input type={"url"}
                                   value={settings.backgroundImage}
                                   onChange={e => setSettings({...settings, backgroundImage: e.target.value})}/>
                        </>)
                    case "color":
                        return (<>
                            <h3>Background Color</h3>
                            <input type={"color"}
                                   value={settings.backgroundColor}
                                   onChange={e => setSettings({...settings, backgroundColor: e.target.value})}/>
                        </>)
                }
            })()}

            <h3>Foreground Color</h3>
            <input type={"color"}
                   value={settings.foregroundColor}
                   onChange={e => setSettings({...settings, foregroundColor: e.target.value})}/>

            <h3>Root folder</h3>
            <select value={settings.rootFolder!}
                    onChange={e => setSettings({...settings, rootFolder: e.target.value})}>
                {getFoldersFromTree(props.tree).map(i =>
                    <option value={i.id}>{i.title ? i.title : "Untitled (id:" + i.id + ")"}</option>
                )}
            </select>

            <h3>Icon Cache</h3>
            <button onClick={_ => getBrowser().storage.local.clear()}>Clear Icon Cache</button>

        </div>
    )
}

/**
 * Walks the tree and creates a list of the folders
 *
 * @param tree The full tree to walk through
 */
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