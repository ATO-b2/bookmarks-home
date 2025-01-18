import React, {useContext, useEffect, useState} from "react";
import CloseIcon from "../assets/close.svg?react"
import {ActiveEdit} from "./Body.tsx";
import {getBrowser} from "../main.tsx";
import RadioButtonGroup from "./RadioButtonGroup.tsx";
import BMIcon from "./BMIcon.tsx";
import IconPicker from "./IconPicker.tsx";




function BMEditor() {
    const [activeEdit, setActiveEdit] = useContext(ActiveEdit);

    useEffect(() => {
        if (!activeEdit) return;
    }, [activeEdit]);

    let isFolder = activeEdit && activeEdit.children && activeEdit.children.length > 0;
    return (
        <div id="settings-menu" className={activeEdit ? "open" : "closed"}>
            <button id="settings-close" onClick={_ => setActiveEdit(null)}>
                <CloseIcon/>
            </button>

            {activeEdit && (<>
                <h1>Edit {isFolder ? "Folder" : "Bookmark"}</h1>

                <h3>Name</h3>
                <input type={"text"} defaultValue={activeEdit?.title} onChange={e => {
                    getBrowser().bookmarks.update(activeEdit!.id, {title: e.target.value})
                }}/>

                {!isFolder && (<>
                    <h3>URL</h3>
                    <input type={"url"} defaultValue={activeEdit?.url} onChange={e => {
                        getBrowser().bookmarks.update(activeEdit!.id, {url: e.target.value})
                    }}/>
                </>)}

                <h3>Icon</h3>
                <IconPicker bmData={activeEdit}/>

            </>)}
        </div>
    );
}

export default BMEditor;