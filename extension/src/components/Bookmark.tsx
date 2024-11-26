import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import GlobeIcon from "../assets/globe.svg"
import React, {SyntheticEvent, useEffect} from "react";
import {getBrowser} from "../main.tsx";

/**
 * A component for a single bookmark
 *
 * @param props.data The BookmarkTreeNode with the data for the bookmark
 */
function Bookmark(props: {data: BookmarkTreeNode}) {
    let [favicon, setFavicon] = React.useState(GlobeIcon);
    let [isSmall, setSmall] = React.useState(true);
    useEffect(() => {
        // faviconURL(props.data.url).then(o => o && setFavicon(o))
        faviconURL(props.data).then(r => {
            if (r) {
                setFavicon(r)
            }
        })
    }, []);

    return(
        <a className="bookmark draggable" href={props.data.url}>
            <div className={"icon-box" + (isSmall ? " small" : "")}>
                <img alt="Bookmark icon"
                     src={favicon}
                     onLoad={(e) => setSmall(e.currentTarget.naturalWidth < 75 && !favicon.startsWith("data:image/svg+xml"))}
                ></img>
            </div>
            <span>{props.data.title}</span>
        </a>
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

    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", data.url!);
    let resp = await fetch(url)
    let imgData = resp.ok ? await toDataURL(url.toString()) : GlobeIcon;
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

export default Bookmark;