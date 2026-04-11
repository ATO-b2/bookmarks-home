import DeleteIcon from "../assets/delete.svg?react";
import EditIcon from "../assets/edit.svg?react";
import MoreIcon from "../assets/more.svg?react";
import React, {useEffect, useState} from "react";
import {getBrowser} from "../main.tsx";
import {ActiveEdit, Settings} from "./Body.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

function ContextMenu(props: {bmData: BookmarkTreeNode, isFolder?: boolean}) {
    let [settings, ] = React.useContext(Settings);
    let [, setActiveEdit] = React.useContext(ActiveEdit)

    const [open, setOpen] = useState(false)

    useEffect(() => {
        let evl = () => {
            open && setOpen(false);
            document.body.removeEventListener('click', evl);
        }
        if (open) {
            console.log("evl registered")
            document.body.addEventListener('click', evl);
        }
    }, [open]);

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setOpen(!open);
    }

    const onDelete = (_: any) => {
        setOpen(false);
        if (props.isFolder) {
            let r = window.confirm("Are you sure you want to delete this folder?\nDeleting a folder will delete all of the items inside of it.").valueOf()
            if (r) {
                getBrowser().bookmarks.removeTree(props.bmData.id);
            }
        } else {
            getBrowser().bookmarks.remove(props.bmData.id);
        }
    };

    const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
        e.preventDefault();
        setActiveEdit(null);
        setActiveEdit(props.bmData);
    };

    if (!settings.editMode) return;

    return (
        <div className={"overflow"}>
            <button onClick={onClick}>
                <MoreIcon/>
            </button>
            {open &&
                <div className={"context-menu"}>
                    <button onClick={onEdit}>
                        <EditIcon />
                        Edit
                    </button>
                    <button className={"del"} onClick={onDelete}>
                        <DeleteIcon/>
                        Delete
                    </button>
                </div>}
        </div>
    )
}

export default ContextMenu;