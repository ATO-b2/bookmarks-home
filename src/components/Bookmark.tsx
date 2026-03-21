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
    let [activeDrag, setActiveDrag] = React.useContext(ActiveDrag);
    const [, setActiveEdit] = useContext(ActiveEdit)

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

    // Dragging
    const handleDrag = () => {
        setActiveDrag(bmData);
    };

    const handleDragEnd = () => {
        setActiveDrag(null);
    };

    // Dropping
    const handleDropLeft = () => {
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.parentId,
            index: bmData.index
        })
        // location.reload()
    };

    const handleDropRight = () => {
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.parentId,
            index: (bmData.index! + 1)
        })
        // location.reload();
    };

    const handleDropCenter = () => {
        chrome.bookmarks.create({
            parentId: bmData.parentId,
            index: bmData.index,
            title: "New Folder"
        }).then(r => {
            getBrowser().bookmarks.move(bmData.id, {parentId: r.id});
            getBrowser().bookmarks.move(activeDrag!.id, {parentId: r.id});
            // location.reload()
        })
    };

    // actions
    const handleDelete = () => {
        getBrowser().bookmarks.remove(bmData.id);
        // location.reload();
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setActiveEdit(null);
        setActiveEdit(bmData);
    };

    return(
        <div className={"bookmark"} id={bmData.id}>
            <a href={bmData.url} draggable={settings.editMode && settings.sort === "from-bookmarks"} onDrag={handleDrag} onDragEnd={handleDragEnd}>
                <IconPre bmData={bmData}/>
                <span>{bmData.title}</span>
            </a>
            {settings.editMode && <ContextMenu onEdit={handleEdit} onDelete={handleDelete}/>}
            {activeDrag && activeDrag !== bmData &&
                <DropTargets onDropLeft={handleDropLeft} onDropRight={handleDropRight} onDropCenter={handleDropCenter}/>}
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