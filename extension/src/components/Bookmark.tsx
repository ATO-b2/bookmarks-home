import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {SyntheticEvent, useEffect} from "react";
import {getBrowser} from "../main.tsx";
import {Settings} from "./Body.tsx";
import ColorThief from 'colorthief'
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

    useEffect(() => {
        faviconURL(props.data).then(r => {
            if (r) {
                setFavicon(r)
                setIconMode("small");
            }
        })
    }, []);

    function handleImageLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        if (e.currentTarget.naturalWidth >= 75 || favicon!.startsWith("data:image/svg+xml")) {
            setIconMode("large")
        } else if(!bgColor) {
            setBgColor(new ColorThief().getColor(e.currentTarget))
        }
    }

    return(
        <div className={"bookmark"}>
            <a draggable={settings.editMode} href={props.data.url}>
                <div className={"icon-box " + (iconMode)} style={bgColor ? {"--icon-bg": `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.2)`} as React.CSSProperties : undefined}>
                    {(() => { switch (iconMode) {
                        case "letter": {
                            let url = new URL(props.data.url!);
                            if (!bgColor) {
                                setBgColor(hashStringToColor(url.hostname));
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
    if (i == null) return i;

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