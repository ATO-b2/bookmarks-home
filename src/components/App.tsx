import React, {useContext, useEffect, useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import SettingsIcon from "../assets/settings.svg?react";
import FolderBody from "./FolderBody.tsx";
import {loadSettings} from "../persistance/Settings.ts";
import {Settings, SidebarContent} from "./Context.tsx";
import CloseIcon from "../assets/close.svg?react"

/**
 * A component for the full body of the application
 * Also stores the trees and settings
 */
function App() {
    const [, setSidebarContent] = useContext(SidebarContent)
    const [settings, setSettings] = useContext(Settings);

    useEffect(() => {
        loadSettings().then(r => setSettings(r))
    }, [])

    if (!settings) return;

    return (
        <>
            {(() => {switch (settings.backgroundMode) {
                case "color": return (<style>{"body {background-color: " + settings.backgroundColor + "; }"}</style>)
                case "image": return (<style>{"body {background-image: url(\"" + settings.backgroundImage + "\"); }"}</style>)
            }})()}
            <style>{"body > .folderBody, a {color: " + settings.foregroundColor + "; }"}</style>
            <div className={"action-area"}>
                <button onClick={() => setSidebarContent(<SettingsEditor/>)}>
                    <SettingsIcon/>
                </button>
            </div>
            <Sidebar/>
            <FolderBody id={settings.rootFolder || '0'}/>
        </>
    )
}

function Sidebar() {
    const [sidebarContent, setSidebarContent] = useContext(SidebarContent)

    let open = !!sidebarContent

    return (
        <div className={`sidebar ${open && "open"}`}>
            <div className={'action-area'}>
                <button
                    onClick={() => setSidebarContent(null)}>
                    <CloseIcon/>
                </button>
            </div>
            {sidebarContent}
        </div>
    )
}

export default App