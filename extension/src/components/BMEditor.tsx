import React, {useContext, useEffect, useState} from "react";
import CloseIcon from "../assets/close.svg?react"
import {ActiveEdit} from "./Body.tsx";
import {getBrowser} from "../main.tsx";
import RadioButtonGroup from "./RadioButtonGroup.tsx";
import BMIcon from "./BMIcon.tsx";


function BMEditor() {
    const [activeEdit, setActiveEdit] = useContext(ActiveEdit);

    const [iconOptions, setIconOptions] = useState<string[]>([]);
    const [gIcon, setGIcon] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!activeEdit) return;

        const gURL = new URL('https://www.google.com/s2/favicons');
        gURL.searchParams.set("sz", "256");
        gURL.searchParams.set("domain_url", activeEdit.url!);
        setGIcon(gURL.toString());

        getBrowser().storage.local.get("icon-aval-"+activeEdit.id).then( r => {
            setIconOptions(r["icon-aval-" + activeEdit.id]);
        });
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
                <h4>Found on the site</h4>
                <div className={"icon-selector"}>
                    { iconOptions &&
                    // <RadioButtonGroup value={undefined} children={
                        iconOptions.map(s =>
                            <BMIcon imgSrc={s}/>
                        )
                    // />
                    }
                </div>
                <h4>From Google</h4>
                <div className={"icon-selector"}>
                    <BMIcon imgSrc={gIcon}/>
                </div>
                <h4>Custom</h4>
                <button className={"default"}>Upload</button>
            </>)}
        </div>
    );
}

export default BMEditor;