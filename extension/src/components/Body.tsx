import React, {useEffect, useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import SettingsIcon from "../assets/settings.svg?react";
import EditIcon from "../assets/edit.svg?react";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderBody from "./FolderBody.tsx";
import {defaultSettings, ISettings, loadSettings, writeSettings} from "../Settings.ts";
import {getBrowser} from "../main.tsx";

export const Settings =
    React.createContext<[ISettings, (arg0: ISettings) => void]>([
        defaultSettings,
        () => {}
    ]);

export const ActiveDrag =
    React.createContext<[boolean, (arg0: boolean) => void]>([
        false,
        () => {}
    ])

/**
 * A component for the full body of the application
 * Also stores the trees and settings
 */
function Body() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<ISettings>(defaultSettings);
    const [selectedBookmarkTree, setSelectedBookmarkTree] = useState<BookmarkTreeNode[]>([])
    const [fullBookmarkTree, setFullBookmarkTree] = useState<BookmarkTreeNode[] | null>([])
    const [activeDrag, setActiveDrag] = useState(false);

    useEffect(() => {
        loadSettings().then(r => {
            setSettings(r);
        })
        getBrowser().bookmarks.getTree().then(t => {
            setFullBookmarkTree(t);
        })
    }, [])

    useEffect(() => {
        writeSettings(settings);
        if (settings.rootFolder) {
            getBrowser().bookmarks.getSubTree(settings.rootFolder).then(t => {
                setSelectedBookmarkTree(t);
            });
        } else {
            getBrowser().bookmarks.getTree().then(t => {
                setSelectedBookmarkTree(t);
            })
        }
    }, [settings]);

    return (
        <Settings.Provider value={[settings!, setSettings]}>
        <ActiveDrag.Provider value={[activeDrag, setActiveDrag]}>
            {(() => {switch (settings.backgroundMode) {
                case "color": return (<style>{"body {background-color: " + settings.backgroundColor + "; }"}</style>)
                case "image": return (<style>{"body {background-image: url(\"" + settings.backgroundImage + "\"); }"}</style>)
            }})()}
            <style>{"body > .folderBody, a {color: " + settings.foregroundColor + "; }"}</style>
            <div id={"action-area"}>
                {settings.editMode && <span>Move mode: Drag bookmarks to change order</span>}
                <button onClick={_ => setSettings({...settings, editMode: !settings.editMode})}>
                    <EditIcon fill={settings.editMode? "lime" : "currentColor"}/>
                </button>
                <button onClick={_ => setSettingsOpen(!settingsOpen)}>
                    <SettingsIcon/>
                </button>
            </div>
            <SettingsEditor tree={fullBookmarkTree!} isOpen={[settingsOpen, setSettingsOpen]}/>
            {selectedBookmarkTree[0] && (<FolderBody data={selectedBookmarkTree[0]}/>)}
        </ActiveDrag.Provider>
        </Settings.Provider>
    )
}

export default Body