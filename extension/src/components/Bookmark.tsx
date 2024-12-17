import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {SyntheticEvent, useContext, useEffect, useState} from "react";
import {getBrowser} from "../main.tsx";
import {ActiveDrag, ActiveEdit, Settings} from "./Body.tsx";
import ColorThief from 'colorthief'
import DropTargets from "./DropTargets.tsx";
import ContextMenu from "./ContextMenu.tsx";

/**
 * A component for a single bookmark
 */
function Bookmark(props: {id: string}) {
    let [settings] = React.useContext(Settings);
    let [activeDrag, setActiveDrag] = React.useContext(ActiveDrag);
    const [, setActiveEdit] = useContext(ActiveEdit)

    let [favicon, setFavicon] = React.useState<string | null>(null);
    let [iconMode, setIconMode] = React.useState<"large" | "small" | "letter">("letter");
    let [bgColor, setBgColor] = React.useState<[number, number, number] | null>(null)
    let [bgColorPriority, setBgColorPriority] = React.useState(0);
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

    useEffect(() => {
        if (!bmData) return;
        faviconURL(bmData).then(r => {
            if (r) {
                setFavicon(r)
                setIconMode("small");
            }
        })
    }, [bmData]);

    if (!bmData) return;

    function handleImageLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        if (e.currentTarget.naturalWidth >= 75 || favicon!.startsWith("data:image/svg+xml")) {
            setIconMode("large")
        } else if(bgColorPriority < 2) {
            setBgColor(new ColorThief().getColor(e.currentTarget))
            setBgColorPriority(2);
        }
    }

    // Dragging
    const handleDrag = () => {
        setActiveDrag(bmData);
    };

    const handleDragEnd = () => {
        setActiveDrag(null);
    };

    // Dropping
    const handleDropLeft = () => {
        console.log("drop left bm")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.parentId,
            index: bmData.index
        })
        location.reload()
    };

    const handleDropRight = () => {
        console.log("drop right bm")
        getBrowser().bookmarks.move(activeDrag!.id, {
            parentId: bmData.parentId,
            index: (bmData.index! + 1)
        })
        location.reload();
    };

    const handleDropCenter = () => {
        console.log("drop center bm")
        chrome.bookmarks.create({
            // type: "folder",
            parentId: bmData.parentId,
            index: bmData.index,
            title: "New Folder"
        }).then(r => {
            getBrowser().bookmarks.move(bmData.id, {parentId: r.id});
            getBrowser().bookmarks.move(activeDrag!.id, {parentId: r.id});
            location.reload()
        })
    };

    const handleDelete = () => {
        getBrowser().bookmarks.remove(bmData.id);
        location.reload();
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setActiveEdit(null);
        setActiveEdit(bmData);
        // setActiveEdit(bmData);
    };

    return(
        <div className={"bookmark"}>
            <a href={bmData.url} draggable={settings.editMode} onDrag={handleDrag} onDragEnd={handleDragEnd}>
                <div className={"icon-box " + (iconMode)}
                     style={bgColor ? {"--icon-bg": `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.2)`} as React.CSSProperties : undefined}>
                    {(() => {
                        switch (iconMode) {
                            case "letter": {
                                let url = new URL(bmData.url!);
                                if (bgColorPriority < 1) {
                                    setBgColor(hashStringToColor(url.hostname));
                                    setBgColorPriority(1);
                                }
                                return (<span className={"letter"}>{url.hostname.charAt(0)}</span>)
                            }
                            case "small": {
                                return (<img alt="Bookmark icon" src={favicon!} onLoad={handleImageLoad}/>)
                            }
                            case "large": {
                                return (<img alt="Bookmark icon" src={favicon!}/>)
                            }
                        }
                    })()}
                </div>
                <span>{bmData.title}</span>
            </a>
            {settings.editMode && <ContextMenu onEdit={handleEdit} onDelete={handleDelete}/>}
            {activeDrag && activeDrag !== bmData &&
                <DropTargets onDropLeft={handleDropLeft} onDropRight={handleDropRight} onDropCenter={handleDropCenter}/>}
        </div>
    );
}

/**
 * Gets the icon for a bookmark
 *
 * @param data The URL of the link
 * @return The URL of the icon
 */
async function faviconURL(data: BookmarkTreeNode) {
    let i = (await getBrowser().storage.local.get("icon-cache-"+data.id))["icon-cache-"+data.id];
    if (i) return i
    // if (i == null) return i;

    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", data.url!);
    let resp = await fetch(url)
    let imgData = resp.ok ? await toDataURL(url.toString()) : null;
    getBrowser().storage.local.set({["icon-cache-"+data.id]: imgData});
    return imgData;
}

function toDataURL(url:string):string {
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

function djb2(str: string){
    let hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
}

function hashStringToColor(str: string): [number, number, number] {
    let hash = djb2(str);
    let r = (hash & 0xFF0000) >> 16;
    let g = (hash & 0x00FF00) >> 8;
    let b = hash & 0x0000FF;
    return [r, g, b];
}

export default Bookmark;