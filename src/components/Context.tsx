import {defaultSettings, ISettings} from "../persistance/Settings.ts";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {ReactNode, useState} from "react";

export const Settings =
    React.createContext<[ISettings, (arg0: ISettings) => void]>(
        [defaultSettings, () => {}]
    );

export const ActiveDrag =
    React.createContext<[BookmarkTreeNode | null, (arg0: BookmarkTreeNode | null) => void]>(
        [null, () => {}]
    )

export const SidebarContent =
    React.createContext<[ReactNode | null, (arg0: ReactNode | null) => void]>(
        [null, () => {}]
    )

export const OpenFolders =
    React.createContext<[string[] | null, (arg0: string[] | null) => void]>(
        [null, () => {}]
    )

function Context(props: {children: ReactNode}) {
    const [settings, setSettings] = useState<ISettings | undefined>(undefined);
    const [activeDrag, setActiveDrag] = useState<BookmarkTreeNode | null>(null);
    const [sidebarContent, setSidebarContent] = useState<ReactNode | null>(null);
    const [openFolders, setOpenFolders] = useState<string[] | null>(null);

    return (
        <Settings value={[settings!, setSettings]}>
        <ActiveDrag value={[activeDrag, setActiveDrag]}>
        <SidebarContent value={[sidebarContent, setSidebarContent]}>
        <OpenFolders value={[openFolders, setOpenFolders]}>
            {props.children}
        </OpenFolders>
        </SidebarContent>
        </ActiveDrag>
        </Settings>
    )
}

export default Context