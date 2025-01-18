import React, {useEffect, useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import SettingsIcon from "../assets/settings.svg?react";
import EditIcon from "../assets/edit.svg?react";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderBody from "./FolderBody.tsx";
import {defaultSettings, ISettings, loadSettings, writeSettings} from "../Settings.ts";
import {getBrowser} from "../main.tsx";
import BMEditor from "./BMEditor.tsx";
import EditOffIcon from "../assets/edit_off.svg?react";

export const Settings =
    React.createContext<[ISettings, (arg0: ISettings) => void]>([
        defaultSettings,
        () => {}
    ]);

export const ActiveDrag =
    React.createContext<[BookmarkTreeNode | null, (arg0: BookmarkTreeNode | null) => void]>([
        null,
        () => {}
    ])

export const ActiveEdit =
    React.createContext<[BookmarkTreeNode | null, (arg0: BookmarkTreeNode | null) => void]>([
        null,
        () => {}
    ])

/**
 * A component for the full body of the application
 * Also stores the trees and settings
 */
function Body() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<ISettings | undefined>(undefined);
    const [activeDrag, setActiveDrag] = useState<BookmarkTreeNode | null>(null);
    const [activeEdit, setActiveEdit] = useState<BookmarkTreeNode | null>(null);

    useEffect(() => {
        loadSettings().then(r => {
            setSettings(r);
        })
    }, [])

    useEffect(() => {
        if (settings) {
            writeSettings(settings);
        }
    }, [settings]);

    if (!settings) return;

    return (
        <Settings.Provider value={[settings!, setSettings]}>
        <ActiveDrag.Provider value={[activeDrag, setActiveDrag]}>
        <ActiveEdit.Provider value={[activeEdit, setActiveEdit]}>
            {(() => {switch (settings.backgroundMode) {
                case "color": return (<style>{"body {background-color: " + settings.backgroundColor + "; }"}</style>)
                case "image": return (<style>{"body {background-image: url(\"" + settings.backgroundImage + "\"); }"}</style>)
            }})()}
            <style>{"body > .folderBody, a {color: " + settings.foregroundColor + "; }"}</style>
            <div id={"action-area"}>
                {/*{settings.editMode && <span>Edit mode: Drag bookmarks to change order</span>}*/}
                {/*<button onClick={_ => setSettings({...settings, editMode: !settings.editMode})}>*/}
                {/*    {settings.editMode ? <EditIcon/> : <EditOffIcon/>}*/}
                {/*</button>*/}
                <button onClick={_ => setSettingsOpen(!settingsOpen)}>
                    <SettingsIcon/>
                </button>
            </div>
            <SettingsEditor isOpen={[settingsOpen, setSettingsOpen]}/>
            <BMEditor/>
            <FolderBody id={settings.rootFolder || '0'}/>
        </ActiveEdit.Provider>
        </ActiveDrag.Provider>
        </Settings.Provider>
    )
}

export default Body