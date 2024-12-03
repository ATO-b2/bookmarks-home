import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {SyntheticEvent, useEffect} from "react";
import {getBrowser} from "../main.tsx";
import {ActiveDrag, Settings} from "./Body.tsx";
import ColorThief from 'colorthief'
import CreateFolderIcon from "../assets/create_folder.svg?react"
import react from "@vitejs/plugin-react";

/**
 * A component for a single bookmark
 *
 * @param props.data The BookmarkTreeNode with the data for the bookmark
 */
function Bookmark(props: {data: BookmarkTreeNode}) {
    let [favicon, setFavicon] = React.useState<string | null>(null);
    let [iconMode, setIconMode] = React.useState<"large" | "small" | "letter">("letter");
    let [settings, setSettings] = React.useContext(Settings);
    let [bgColor, setBgColor] = React.useState<[number, number, number] | null>(null)
    let [bgColorPriority, setBgColorPriority] = React.useState(0);
    let [activeDrag, setActiveDrag] = React.useContext(ActiveDrag);
    let [dropRight, setDropRight] = React.useState(false);
    let [dropLeft, setDropLeft] = React.useState(false);
    let [dropCenter, setDropCenter] = React.useState(false);
    let [thisDragged, setThisDragged] = React.useState(false);

    useEffect(() => {
        faviconURL(props.data).then(r => {
            if (r) {
                setFavicon(r)
                setIconMode("small");
            }
        })
    }, []);

    useEffect(() => {
        setDropLeft(false);
        setDropRight(false);
        setDropCenter(false);
    }, [activeDrag]);

    function handleImageLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        if (e.currentTarget.naturalWidth >= 75 || favicon!.startsWith("data:image/svg+xml")) {
            setIconMode("large")
        } else if(bgColorPriority < 2) {
            setBgColor(new ColorThief().getColor(e.currentTarget))
            setBgColorPriority(2);
        }
    }

    function handleDragStart(e: React.DragEvent<HTMLAnchorElement>) {
        // e.dataTransfer.setData("text/bm-id", props.data.id);
        // setActiveDrag(true);
        console.log("data", e.dataTransfer.getData("text/bm-id").toString())
    }

    function handleDrag(e: React.DragEvent<HTMLAnchorElement>) {
        // e.dataTransfer.setData("text/bm-id", props.data.id);
        setActiveDrag(props.data);
        setThisDragged(true);
        // e.dataTransfer.dropEffect = "move";
    }

    function handleDragEnd() {
        setActiveDrag(null);
        setThisDragged(false);
    }

    return(
        <div className={"bookmark"}>
            <a draggable={settings.editMode} href={props.data.url} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
                <div className={"icon-box " + (iconMode)} style={bgColor ? {"--icon-bg": `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.2)`} as React.CSSProperties : undefined}>
                    {(() => { switch (iconMode) {
                        case "letter": {
                            let url = new URL(props.data.url!);
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
                            return(<img alt="Bookmark icon" src={favicon!}/>)
                        }
                    }})()}
                </div>
                <span>{props.data.title}</span>
            </a>
            {activeDrag && !thisDragged && (
                <div className={"drop-targets"}>
                    <div
                        className={"left"}
                        onDragOver={e => {
                            e.preventDefault()
                            setDropLeft(true)
                        }}
                        onDragEnter={e =>{
                            e.preventDefault()
                        }}
                        onDragLeave={_ => {
                            setDropLeft(false)
                        }}
                        onDrop={e => {
                            getBrowser().bookmarks.move(activeDrag.id, {
                                parentId: props.data.parentId,
                                index: props.data.index
                            })
                            location.reload()
                        }}
                        style={dropLeft ? undefined : {opacity: 0}}
                        // hidden={!dropLeft}
                    >
                        <div/>
                    </div>
                    <div
                        className={"right"}
                        onDragOver={e => {
                            e.preventDefault();
                            setDropRight(true);
                        }}
                        onDragEnter={e => {
                            e.preventDefault();
                        }}
                        onDragLeave={_ => {
                            setDropRight(false)
                        }}
                        onDrop={e => {
                            getBrowser().bookmarks.move(activeDrag.id, {
                                parentId: props.data.parentId,
                                index: (props.data.index! + 1)
                            })
                            location.reload()
                            e.preventDefault()
                        }}
                        style={dropRight ? undefined : {opacity: 0}}
                        // hidden={!dropRight}
                    >
                        <div/>
                    </div>
                    <div
                        className={"center"}
                        onDragOver={e => {
                            e.preventDefault()
                            setDropCenter(true)
                            // console.log("dropped")
                        }}
                        onDragEnter={e => {
                            e.preventDefault()
                            // console.log("enter")
                        }}
                        onDragLeave={_ => {
                            setDropCenter(false)
                            // console.log("exit")
                        }}
                        onDrop={e => {
                            e.preventDefault();
                            chrome.bookmarks.create({
                                // type: "folder",
                                parentId: props.data.parentId,
                                index: props.data.index,
                                title: "New Folder"
                            }).then(r => {
                                getBrowser().bookmarks.move(props.data.id, {parentId: r.id});
                                getBrowser().bookmarks.move(activeDrag?.id, {parentId: r.id});
                                location.reload()
                            })
                        }}
                        style={dropCenter ? undefined : {opacity: 0}}
                        // hidden={!dropCenter}
                    >
                        <CreateFolderIcon/>
                    </div>
                </div>
            )}
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
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
}

function hashStringToColor(str: string): [number, number, number] {
    var hash = djb2(str);
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return [r, g, b];
}

export default Bookmark;