import DeleteIcon from "../assets/delete.svg?react";
import EditIcon from "../assets/edit.svg?react";
import DragIcon from "../assets/drag.svg?react";
import MoreIcon from "../assets/more.svg?react";
import React, {useEffect, useState} from "react";

function ContextMenu(props: {onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void, onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void}) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        let evl = () => {
            console.log("clicked")
            open && setOpen(false);
            console.log("evl unregistered")
            document.body.removeEventListener('click', evl);
        }
        if (open) {
            console.log("evl registered")
            document.body.addEventListener('click', evl);
        }
    }, [open]);

    return (
        <div className={"overflow"}>
            <button onClick={e => {
                e.preventDefault();
                setOpen(!open);
            }}>
                <MoreIcon/>
            </button>
            {open && <div className={"context-menu"}>
                <button onClick={e => {
                    setOpen(false);
                    props.onEdit(e);
                }}>
                    <EditIcon />
                    Edit
                </button>
                <button className={"del"} onClick={e => {
                    setOpen(false);
                    props.onDelete(e);
                }}>
                    <DeleteIcon/>
                    Delete
                </button>
            </div>}
        </div>
    )
}

export default ContextMenu;