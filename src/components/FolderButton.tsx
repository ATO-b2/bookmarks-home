import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderIcon from "../assets/folder.svg?react"
import FolderIconOpen from "../assets/folder_open.svg?react"
import React, {useEffect, useRef, useState} from "react";
import DropTargets from "./DropTargets.tsx";
import {ActiveDrag, OpenFolders, Settings} from "./Body.tsx";
import {getBrowser} from "../main.tsx";
import ContextMenu from "./ContextMenu.tsx";
import FolderModal from "./FolderModal.tsx";

/**
 * A component for the button used to open a bookmark folder.
 * This is themed the same as a bookmark
 */
function FolderButton(props: {id: string}) {
    let [settings, ] = React.useContext(Settings);
    let [, setActiveDrag] = React.useContext(ActiveDrag);
    let [openFolders, setOpenFolders] = React.useContext(OpenFolders);

    const [folderOpen, setFolderOpen] = useState<undefined | boolean>(undefined);
    const [bmData, setBmData] = useState<BookmarkTreeNode | undefined>()

    const folderButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getBrowser().storage.local.set({['keepopen-'+props.id]: folderOpen})

        if (folderOpen) {
            setOpenFolders([...openFolders, props.id]);
        } else {
            setOpenFolders(openFolders.filter(id => id !== props.id));
        }
    }, [folderOpen]);

    useEffect(() => {
        if (settings.keepFoldersOpen) {
            getBrowser().storage.local.get('keepopen-' + props.id).then(r => {
                setFolderOpen(r['keepopen-' + props.id] == true);
            })
        } else {
            setFolderOpen(false);
        }
        getBrowser().bookmarks.get(props.id).then(r => {
            setBmData(r[0])
        })
    }, []);

    const modalZIndex = 100 + openFolders.indexOf(props.id);

    if (!bmData) return;

    return(
        <>
            <div className={"bookmark"} id={bmData.id} ref={folderButtonRef} style={folderOpen ? {
                zIndex: modalZIndex + 1
            } : undefined}>
                <a
                    onClick={() => setFolderOpen(!folderOpen)}
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
                    onClose={() => setFolderOpen(false)}
                />
            )}
        </>
    );
}

export default FolderButton