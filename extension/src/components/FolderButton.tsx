import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderBody from "./FolderBody.tsx";
import FolderIcon from "../assets/folder.svg?react"
import FolderIconOpen from "../assets/folder_open.svg?react"
import React, {useState} from "react";
import DropTargets from "./DropTargets.tsx";
import {ActiveDrag, Settings} from "./Body.tsx";
import {getBrowser} from "../main.tsx";

/**
 * A component for the button used to open a bookmark folder.
 * This is themed the same as a bookmark
 *
 * @param props.data The BookmarkTreeNode containing the data of the folder
 */
function FolderButton(props: {data: BookmarkTreeNode}) {
    let [settings, _] = React.useContext(Settings);
    let [activeDrag, setActiveDrag] = React.useContext(ActiveDrag);

    const [folderOpen, setFolderOpen] = useState(false);

    // Dragging
    function handleDragStart(e: React.DragEvent<HTMLAnchorElement>) {
        e.dataTransfer.setData("sowgro", "placeholder")
    }

    function handleDrag() {
        setActiveDrag(props.data);
    }

    function handleDragEnd() {
        console.log("drop end")
        setActiveDrag(null);
    }

    // Dropping
    function handleDropLeft() {
        console.log("drop left folder")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: props.data.parentId,
            index: props.data.index
        })
        location.reload()
    }

    function handleDropRight() {
        console.log("drop right folder")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: props.data.parentId,
            index: (props.data.index! + 1)
        })
        location.reload();
    }

    function handleDropCenter() {
        console.log("drop center folder")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: props.data.id
        });
        location.reload()
    }

    return(
        <>
            <div className={"bookmark"}>
                <a onClick={() => setFolderOpen(!folderOpen)} draggable={settings.editMode} onDrag={handleDrag} onDragEnd={handleDragEnd}>
                    <div className="icon-box">
                        {folderOpen ? <FolderIconOpen/> : <FolderIcon/>}
                    </div>
                    <span>{props.data.title}</span>
                </a>
                {activeDrag && activeDrag !== props.data &&
                    <DropTargets onDropLeft={handleDropLeft} onDropRight={handleDropRight} onDropCenter={handleDropCenter}/>}
            </div>
            {folderOpen && props.data.children && props.data.children.length > 0 &&
                <FolderBody data={props.data}/>}
        </>
    );
}

export default FolderButton