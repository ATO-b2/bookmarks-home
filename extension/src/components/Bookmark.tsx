import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {useContext, useEffect, useState} from "react";
import {getBrowser} from "../main.tsx";
import {ActiveDrag, ActiveEdit, Settings} from "./Body.tsx";
import DropTargets from "./DropTargets.tsx";
import ContextMenu from "./ContextMenu.tsx";
import BMIcon from "./BMIcon.tsx";

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
        location.reload()
    };

    const handleDropRight = () => {
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.parentId,
            index: (bmData.index! + 1)
        })
        location.reload();
    };

    const handleDropCenter = () => {
        chrome.bookmarks.create({
            parentId: bmData.parentId,
            index: bmData.index,
            title: "New Folder"
        }).then(r => {
            getBrowser().bookmarks.move(bmData.id, {parentId: r.id});
            getBrowser().bookmarks.move(activeDrag!.id, {parentId: r.id});
            location.reload()
        })
    };

    // actions
    const handleDelete = () => {
        getBrowser().bookmarks.remove(bmData.id);
        location.reload();
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setActiveEdit(null);
        setActiveEdit(bmData);
    };

    return(
        <div className={"bookmark"}>
            <a href={bmData.url} draggable={settings.editMode} onDrag={handleDrag} onDragEnd={handleDragEnd}>
                <IconPre id={bmData.id} bmUrl={bmData.url!}/>
                <span>{bmData.title}</span>
            </a>
            {settings.editMode && <ContextMenu onEdit={handleEdit} onDelete={handleDelete}/>}
            {activeDrag && activeDrag !== bmData &&
                <DropTargets onDropLeft={handleDropLeft} onDropRight={handleDropRight} onDropCenter={handleDropCenter}/>}
        </div>
    );
}

export default Bookmark;

function IconPre(props: {bmUrl: string, id:string}) {
    const [data, setData] = useState()

    useEffect(() => {
        findIcon(props.bmUrl, props.id).then(r => {
            setData(r);
        })
    }, []);

    // if (!data) return;
    return <BMIcon bmUrl={props.bmUrl} imgSrc={data}/>
}

/**
 * 1. check for icon cache
 * 2. check if the user selected an icon
 * 3. use the best icon from the available icons
 * 4. search googles icon database
 */
async function findIcon(bmUrl: string, id:string) {
    let cachedIcon = (await getBrowser().storage.local.get("icon-cache-"+id))["icon-cache-"+id];
    if (cachedIcon) return cachedIcon

    // let selectedUrl: string[] = (await getBrowser().storage.local.get("icon-aval-"+data.id))["icon-aval-"+data.id]
    // if (selectedUrl.length > 0) {
    //     await getBrowser().storage.local.set({["icon-cache-"+data.id]: selectedUrl[0]});
    //     return selectedUrl[0];
    // }

    // const url = new URL('https://www.google.com/s2/favicons');
    // url.searchParams.set("sz", "256");
    // url.searchParams.set("domain_url", bmUrl);
    // let resp = await fetch(url)
    // let imgData = resp.ok ? await toDataURL(url.toString()) : null;
    // getBrowser().storage.local.set({["icon-cache-"+bmUrl]: imgData});
    // return imgData;
}

function toDataURL(url: string): string {
    // @ts-ignore
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))
}