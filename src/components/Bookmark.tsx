import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {useContext, useEffect, useState} from "react";
import {getBrowser} from "../main.tsx";
import {ActiveDrag, ActiveEdit, Settings} from "./Body.tsx";
import DropTargets from "./DropTargets.tsx";
import ContextMenu from "./ContextMenu.tsx";
import BMIcon from "./BMIcon.tsx";
import {getIcon} from "../Icons.ts";

/**
 * A component for a single bookmark
 */
function Bookmark(props: {id: string}) {
    let [settings] = React.useContext(Settings);
    let [, setActiveDrag] = React.useContext(ActiveDrag);

    const [bmData, setBmData] = useState<BookmarkTreeNode | undefined>()

    useEffect(() => {
        getBrowser().bookmarks.get(props.id).then(r => {
            setBmData(r[0]);
        })

        getBrowser().bookmarks.onChanged.addListener((id: string) => {
            if (id !== props.id) return;
            getBrowser().bookmarks.get(props.id).then(r => {
                setBmData(r[0]);
            })
        })
    }, []);

    if (!bmData) return;

    return(
        <div className={"bookmark"} id={bmData.id}>
            <a
                href={bmData.url}
                draggable={settings.enableDragging}
                onDragStart={() => setActiveDrag(bmData)}
                onDragEnd={() => setActiveDrag(null)}
            >
                <IconPre bmData={bmData}/>
                <span>{bmData.title}</span>
            </a>
            <ContextMenu bmData={bmData}/>
            <DropTargets bmData={bmData}/>
        </div>
    );
}

export default Bookmark;

function IconPre(props: {bmData: BookmarkTreeNode}) {
    const [data, setData] = useState<string>()

    useEffect(() => {
        getIcon(props.bmData, setData)
    }, []);

    // if (!data) return;
    return <BMIcon bmUrl={props.bmData.url} imgSrc={data}/>
}