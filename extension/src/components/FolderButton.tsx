import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderBody from "./FolderBody.tsx";
import FolderIcon from "../assets/folder.svg?react"
import FolderIconOpen from "../assets/folder_open.svg?react"
import React, {useEffect, useState} from "react";
import DropTargets from "./DropTargets.tsx";
import {ActiveDrag, ActiveEdit, Settings} from "./Body.tsx";
import {getBrowser} from "../main.tsx";
import ContextMenu from "./ContextMenu.tsx";

/**
 * A component for the button used to open a bookmark folder.
 * This is themed the same as a bookmark
 */
function FolderButton(props: {id: string}) {
    let [settings, ] = React.useContext(Settings);
    let [activeDrag, setActiveDrag] = React.useContext(ActiveDrag);
    let [, setActiveEdit] = React.useContext(ActiveEdit)

    const [folderOpen, setFolderOpen] = useState<undefined | boolean>(undefined);
    const [bmData, setBmData] = useState<BookmarkTreeNode | undefined>()

    useEffect(() => {
        console.log(props.id+" state="+folderOpen)
        getBrowser().storage.local.set({['keepopen-'+props.id]: folderOpen})
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

    if (!bmData) return;

    // Dragging
    const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>) => {
        e.dataTransfer.setData("sowgro", "placeholder")
    };

    const handleDrag = () => {
        setActiveDrag(bmData);
    };

    const handleDragEnd = () => {
        console.log("drop end")
        setActiveDrag(null);
    };

    // Dropping
    const handleDropLeft = () => {
        console.log("drop left folder")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.parentId,
            index: bmData.index
        })
        location.reload()
    };

    const handleDropRight = () => {
        console.log("drop right folder")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.parentId,
            index: (bmData.index! + 1)
        })
        location.reload();
    };

    const handleDropCenter = () => {
        console.log("drop center folder")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.id
        });
        location.reload()
    };

    const handleDelete = () => {
        getBrowser().bookmarks.removeTree(bmData.id);
        location.reload();
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setActiveEdit(null);
        setActiveEdit(bmData);
    };

    return(
        <>
            <div className={"bookmark"}>
                <a onClick={() => setFolderOpen(!folderOpen)} draggable={settings.editMode} onDrag={handleDrag}
                   onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="icon-box">
                        {folderOpen ? <FolderIconOpen/> : <FolderIcon/>}
                    </div>
                    <span>{bmData.title}</span>
                </a>
                {settings.editMode && <ContextMenu onEdit={handleEdit} onDelete={handleDelete}/>}
                {activeDrag && activeDrag !== bmData &&
                    <DropTargets onDropLeft={handleDropLeft} onDropRight={handleDropRight} onDropCenter={handleDropCenter}/>}
            </div>
            {folderOpen && /*bmData.children && bmData.children.length > 0 &&*/
                <FolderBody id={bmData.id}/>}
        </>
    );
}

export default FolderButton