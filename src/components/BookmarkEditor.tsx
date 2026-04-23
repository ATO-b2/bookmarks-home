import React, {useContext, useEffect, useState} from "react";
import CloseIcon from "../assets/close.svg?react"
import {ActiveEdit} from "./Context.tsx";
import {getBrowser} from "../main.tsx";
import IconPicker from "./IconPicker.tsx";

function BookmarkEditor() {
    const [activeEdit, setActiveEdit] = useContext(ActiveEdit);

    useEffect(() => {
        if (!activeEdit) return;
    }, [activeEdit]);

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        getBrowser().bookmarks.update(activeEdit!.id, {title: e.target.value})
    }

    function handleURLChange(e: React.ChangeEvent<HTMLInputElement>) {
        getBrowser().bookmarks.update(activeEdit!.id, {url: e.target.value})
    }

    let isFolder = activeEdit && !activeEdit.url
    return (
        <div id="settings-menu" className={activeEdit ? "open" : "closed"}>
            <button id="settings-close" onClick={_ => setActiveEdit(null)}>
                <CloseIcon/>
            </button>

            {activeEdit && (<>
                <h1>Edit {isFolder ? "Folder" : "Bookmark"}</h1>

                <h3>Name</h3>
                <input type={"text"} defaultValue={activeEdit?.title} onBlur={handleTitleChange}/>

                {!isFolder && (<>
                    <h3>URL</h3>
                    <input type={"url"} defaultValue={activeEdit?.url} onBlur={handleURLChange}/>

                    <h3>Icon</h3>
                    <IconPicker bmData={activeEdit}/>
                </>)}
            </>)}
        </div>
    );
}

export default BookmarkEditor;