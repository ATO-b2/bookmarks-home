import React, {useContext, useEffect, useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import SettingsIcon from "../assets/settings.svg?react";
import FolderBody from "./FolderBody.tsx";
import {loadSettings, writeSettings} from "../Settings.ts";
import BookmarkEditor from "./BookmarkEditor.tsx";
import {Settings} from "./Context.tsx";

/**
 * A component for the full body of the application
 * Also stores the trees and settings
 */
function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useContext(Settings);

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
        <>
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
            <BookmarkEditor/>
            <FolderBody id={settings.rootFolder || '0'}/>
        </>
    )
}

export default App