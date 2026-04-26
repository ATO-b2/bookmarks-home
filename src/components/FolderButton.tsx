import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderIcon from "../assets/folder.svg?react"
import FolderIconOpen from "../assets/folder_open.svg?react"
import React, {useEffect, useRef, useState} from "react";
import DropTargets from "./DropTargets.tsx";
import {ActiveDrag, OpenFolders, Settings} from "./Context.tsx";
import ContextMenu from "./ContextMenu.tsx";
import FolderModal from "./FolderModal.tsx";
import {OpenFoldersDAO} from "../persistance/OpenFolders.ts";
import {BookmarkDAO} from "../persistance/Bookmarks.ts";

function FolderButton(props: {id: string}) {
    let [settings, ] = React.useContext(Settings);
    let [, setActiveDrag] = React.useContext(ActiveDrag);
    let [openFolders, setOpenFolders] = React.useContext(OpenFolders);

    let [folderOpen, setFolderOpen] = useState<boolean>(false);
    let [bmData, setBmData] = useState<BookmarkTreeNode | undefined>()

    const folderButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFolderOpen(openFolders!.includes(props.id))
        BookmarkDAO.get(props.id).then(r => setBmData(r))
    }, []);

    const handleFolderChange = (value: boolean) => {
        setFolderOpen(folderOpen = value);
        if (folderOpen) {
            setOpenFolders(openFolders = [...openFolders!, props.id]);
        } else {
            setOpenFolders(openFolders = openFolders!.filter(id => id !== props.id));
        }
        OpenFoldersDAO.put(openFolders!);
    }

    const modalZIndex = 100 + openFolders!.indexOf(props.id);

    if (!bmData) return;

    return(
        <>
            <div className={"bookmark"} id={bmData.id} ref={folderButtonRef} style={folderOpen ? {
                zIndex: modalZIndex + 1
            } : undefined}>
                <a
                    onClick={() => handleFolderChange(!folderOpen)}
                    draggable={settings.enableDragging}
                    onDragStart={() => setActiveDrag(bmData)}
                    onDragEnd={() => setActiveDrag(null)}
                >
                    <div className="icon-box">
                        {folderOpen ? <FolderIconOpen/> : <FolderIcon/>}
                    </div>
                    <span>{bmData.title}</span>
                </a>
                <ContextMenu bmData={bmData} isFolder={true}/>
                <DropTargets bmData={bmData} isFolder={true}/>
            </div>
            {folderOpen && (
                <FolderModal
                    id={bmData.id}
                    folderRef={folderButtonRef}
                    zIndex={modalZIndex}
                    onClose={() => handleFolderChange(false)}
                />
            )}
        </>
    );
}

export default FolderButton