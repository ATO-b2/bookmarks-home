import React, {useEffect} from "react";
import {ActiveDrag, Settings} from "./Context.tsx";
import CreateFolderIcon from "../assets/create_folder.svg?react"
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {BookmarkDAO} from "../persistance/Bookmarks.ts";

function DropTarget(props: {children: React.ReactNode, className: string, onDrop: () => void}) {
    let [activeDrag, _] = React.useContext(ActiveDrag);

    let [drop, setDrop] = React.useState(false);

    useEffect(() => {
        setDrop(false);
    }, [activeDrag]);

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDrop(true)
    }

    function handleDragLeave() {
        setDrop(false)
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        props.onDrop();
    }

    return (
        <div
            className={`${props.className} drop-target ${drop ? "visible" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {props.children}
        </div>
    );
}

function DropTargets(props: { bmData: BookmarkTreeNode, isFolder?: boolean }) {
    let [activeDrag] = React.useContext(ActiveDrag);
    let [settings, ] = React.useContext(Settings);

    const onDropLeft = () => {
        BookmarkDAO.move(activeDrag!.id, {
            parentId: props.bmData.parentId,
            index: props.bmData.index
        })
    };

    const onDropRight = () => {
        BookmarkDAO.move(activeDrag!.id, {
            parentId: props.bmData.parentId,
            index: (props.bmData.index! + 1)
        })
    };

    const onDropCenter = () => {
        if (props.isFolder) {
            BookmarkDAO.move(activeDrag!.id, {
                parentId: props.bmData.id
            });
        } else {
            chrome.bookmarks.create({
                parentId: props.bmData.parentId,
                index: props.bmData.index,
                title: "New Folder"
            }).then(r => {
                BookmarkDAO.move(props.bmData.id, {parentId: r.id});
                BookmarkDAO.move(activeDrag!.id, {parentId: r.id});
            })
        }
    };

    if (!settings.editMode
        || !activeDrag
        || activeDrag === props.bmData
        || settings.sort !== "from-bookmarks"
    ) return;

    return (
        <div className={"drop-targets"}>
            <DropTarget className={"left"} onDrop={onDropLeft}>
                <div/>
            </DropTarget>
            <DropTarget className={"right"} onDrop={onDropRight}>
                <div/>
            </DropTarget>
            <DropTarget className={"center"} onDrop={onDropCenter}>
                <CreateFolderIcon/>
            </DropTarget>
        </div>
    );
}

export default DropTargets;