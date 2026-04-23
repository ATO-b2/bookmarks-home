import RadioButtonGroup from "./RadioButtonGroup.tsx";
import React, {useContext, useEffect, useState} from "react";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {Settings} from "./Context.tsx";
import {getBrowser} from "../main.tsx";
import {defaultSettings, writeSettings} from "../persistance/Settings.ts";
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

    let resetDefaultColors = () => {
        patchSettings({
            foregroundColor: defaultSettings.foregroundColor,
            backgroundColor: defaultSettings.backgroundColor,
            modalForegroundColor: defaultSettings.modalForegroundColor,
            modalBackgroundColor: defaultSettings.modalBackgroundColor,
            modalBorderColor: defaultSettings.modalBorderColor,
        })
        saveSettings();
    }

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

        <h3>Colors</h3>
        <label>
            Foreground:
            <input
                type={"color"}
                value={settings.foregroundColor}
                onChange={e => patchSettings({foregroundColor: e.target.value}, false)}
                onBlur={saveSettings}
            />
        </label>
        <label>
            Background:
            <input
                type={"color"}
                value={settings.backgroundColor}
                onChange={e => patchSettings({backgroundColor: e.target.value}, false)}
                onBlur={saveSettings}
            />
        </label>
        <label>
            Folder foreground:
            <input
                type={"color"}
                value={settings.modalForegroundColor}
                onChange={e => patchSettings({modalForegroundColor: e.target.value}, false)}
                onBlur={saveSettings}
            />
        </label>
        <label>
            Folder background:
            <input
                type={"color"}
                value={settings.modalBackgroundColor}
                onChange={e => patchSettings({modalBackgroundColor: e.target.value}, false)}
                onBlur={saveSettings}
            />
        </label>
        <label>
            Folder border:
            <input
                type={"color"}
                value={settings.modalBorderColor}
                onChange={e => patchSettings({modalBorderColor: e.target.value}, false)}
                onBlur={saveSettings}
            />
        </label>
        <br/>
        <button
            className={"default"}
            onClick={resetDefaultColors}
        >
            Reset default colors
        </button>

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