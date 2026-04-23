import React, {useContext, useEffect, useState} from "react";
import SettingsEditor from "./SettingsEditor.tsx";
import SettingsIcon from "../assets/settings.svg?react";
import FolderBody from "./FolderBody.tsx";
import {defaultSettings, loadSettings} from "../persistance/Settings.ts";
import {Settings, SidebarContent} from "./Context.tsx";
import CloseIcon from "../assets/close.svg?react"
import SwapIcon from "../assets/swap.svg?react"

/**
 * A component for the full body of the application
 * Also stores the trees and settings
 */
function App() {
    const [, setSidebarContent] = useContext(SidebarContent)
    const [settings, setSettings] = useContext(Settings);

    useEffect(() => {
        loadSettings().then(r => setSettings(r));
    }, [])

    useEffect(() => {
        if (!settings) return;

        const css = document.documentElement.style
        css.setProperty('--background', settings.backgroundColor);
        css.setProperty('--foreground', settings.foregroundColor);
        css.setProperty('--modal-border', settings.modalBorderColor);
        css.setProperty('--modal-foreground', settings.modalForegroundColor)
        css.setProperty('--modal-background', settings.modalBackgroundColor);
    }, [settings]);

    if (!settings) return;

    return (
        <>
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

    const [swapSides, setSwapSides] = useState(false)

    let open = !!sidebarContent

    return (
        <div className={`sidebar ${open ? 'open' : ''} ${swapSides ? 'swap-sides' : ''}`}>
            <div className={'action-area'}>
                <button onClick={() => setSwapSides(!swapSides)}>
                    <SwapIcon/>
                </button>
                <button onClick={() => setSidebarContent(null)}>
                    <CloseIcon/>
                </button>
            </div>
            {sidebarContent}
        </div>
    )
}

export default App