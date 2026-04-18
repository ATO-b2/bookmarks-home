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

export const ActiveEdit =
    React.createContext<[BookmarkTreeNode | null, (arg0: BookmarkTreeNode | null) => void]>(
        [null, () => {}]
    )

export const OpenFolders =
    React.createContext<[string[], (arg0: string[]) => void]>(
        [[], () => {}]
    )

function Context(props: {children: ReactNode}) {
    const [settings, setSettings] = useState<ISettings | undefined>(undefined);
    const [activeDrag, setActiveDrag] = useState<BookmarkTreeNode | null>(null);
    const [activeEdit, setActiveEdit] = useState<BookmarkTreeNode | null>(null);
    const [openFolders, setOpenFolders] = useState<string[]>([]);

    return (
        <Settings value={[settings!, setSettings]}>
        <ActiveDrag value={[activeDrag, setActiveDrag]}>
        <ActiveEdit value={[activeEdit, setActiveEdit]}>
        <OpenFolders value={[openFolders, setOpenFolders]}>
            {props.children}
        </OpenFolders>
        </ActiveEdit>
        </ActiveDrag>
        </Settings>
    )
}

export default Context