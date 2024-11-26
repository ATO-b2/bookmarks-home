import React, {useEffect, useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import imageUrl from "../assets/settings.svg"
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderBody from "./FolderBody.tsx";
import {defaultSettings, ISettings, loadSettings, writeSettings} from "../Settings.ts";
import {getBrowser} from "../main.tsx";

export const Settings =
    React.createContext<[ISettings, (arg0: ISettings) => void]>([
    defaultSettings,
    () => {}
]);

/**
 * A component for the full body of the application
 * Also stores the trees and settings
 */
function Body() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<ISettings>(defaultSettings);
    const [selectedBookmarkTree, setSelectedBookmarkTree] = useState<BookmarkTreeNode[]>([])
    const [fullBookmarkTree, setFullBookmarkTree] = useState<BookmarkTreeNode[] | null>([])

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
        if (settings?.rootFolder) {
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
            {(() => {switch (settings.backgroundMode) {
                case "color": return (<style>{"body {background-color: " + settings.backgroundColor + "; }"}</style>)
                case "image": return (<style>{"body {background-image: url(\"" + settings.backgroundImage + "\"); }"}</style>)
            }})()}
            <style>{"body > .folderBody, a {color: " + settings.foregroundColor + "; }"}</style>
            <button id="settings-button" onClick={_ => setSettingsOpen(!settingsOpen)}>
                <img alt="open settings" src={imageUrl}/>
            </button>
            <SettingsEditor tree={fullBookmarkTree!} isOpen={[settingsOpen, setSettingsOpen]}/>
            {selectedBookmarkTree[0] && (<FolderBody data={selectedBookmarkTree[0]}/>)}
        </Settings.Provider>
    )
}

export default Body