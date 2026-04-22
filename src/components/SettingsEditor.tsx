import RadioButtonGroup from "./RadioButtonGroup.tsx";
import React, {useContext, useEffect, useState} from "react";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {Settings} from "./Context.tsx";
import {getBrowser} from "../main.tsx";
import {writeSettings} from "../persistance/Settings.ts";
import {getAllFolders} from "../util/bookmarkUtils.ts";

function SettingsEditor() {
    const [settings, setSettings] = useContext(Settings)
    const [folders, setFolders] = useState<BookmarkTreeNode[]>([])

    function saveSettings() {
        console.log("saved settings") // TODO toast this
        writeSettings(settings);
    }

    function patchSettings(newItems: {}, save: boolean = true) {
        setSettings({
            ...settings,
            ...newItems
        })
        if (save) {
            saveSettings();
        }
    }

    useEffect(() => {
        getAllFolders().then(r => setFolders(r));
    }, []);

    return (<>
        <h1>Settings</h1>

        <h3>Sort</h3>
        <RadioButtonGroup
            value={settings.sort}
            onChange={e => patchSettings({sort: e})}
        >
            <option value={"from-bookmarks"}>Custom Order</option>
            <option value={"alphabetical"}>Alphabetical</option>
            <option value={"recent"}>Recently used</option>
        </RadioButtonGroup>
        <br/>
        <label>
            <input
                type={"checkbox"}
                checked={settings.foldersFirst}
                onChange={e => patchSettings({foldersFirst: e.target.checked})}
            />
            Sort Folders First
        </label>

        <h3>Background Type</h3>
        <RadioButtonGroup
            value={settings.backgroundMode}
            onChange={e => patchSettings({backgroundMode: e})}
        >
            <option value={"theme"}>Default</option>
            <option value={"color"}>Solid Color</option>
            <option value={"image"}>Image</option>
        </RadioButtonGroup>

        {(() => {switch (settings.backgroundMode) {
            case "image": return (<>
                <h3>Background Image URL</h3>
                <input
                    type={"url"}
                    value={settings.backgroundImage}
                    onBlur={e => patchSettings({backgroundImage: e.target.value})}
                />
            </>)
            case "color": return (<>
                <h3>Background Color</h3>
                <input
                    type={"color"}
                    value={settings.backgroundColor}
                    onChange={e => patchSettings({backgroundColor: e.target.value}, false)}
                    onBlur={saveSettings}
                />
            </>)
        }})()}

        <h3>Foreground Color</h3>
        <input
            type={"color"}
            value={settings.foregroundColor}
            onChange={e => patchSettings({foregroundColor: e.target.value}, false)}
            onBlur={saveSettings}
        />

        <h3>Root folder</h3>
        <select
            value={settings.rootFolder!}
            onChange={e => patchSettings({rootFolder: e.target.value})}
        >
            {folders.map(i =>
                <option value={i.id}>{i.title ? i.title : "Untitled (id:" + i.id + ")"}</option>
            )}
        </select>

        <h3>Icon Cache</h3>
        <button
            className={"default"}
            onClick={_ => getBrowser().storage.local.clear()}
        >
            Clear Icon Cache
        </button>

        <h3>Items</h3>
        <label>
            <input
                type={"checkbox"}
                checked={settings.enableDragging}
                onChange={e => patchSettings({enableDragging: e.target.checked})}
            />
            Enable dragging links
        </label>
        <label>
            <input
                type={"checkbox"}
                checked={settings.editMode}
                onChange={e => patchSettings({editMode: e.target.checked})}
            />
            Enable editing items
        </label>

        <h3>Open Folders</h3>
        <label>
            <input
                type={"checkbox"}
                checked={settings.keepFoldersOpen}
                onChange={e => patchSettings({keepFoldersOpen: e.target.checked})}
            />
            Keep folders open
        </label>
    </>)
}

export default SettingsEditor;