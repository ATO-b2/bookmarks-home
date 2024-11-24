import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import GlobeIcon from "../assets/globe.svg"
import React, {useEffect} from "react";
import {getBrowser} from "../main.tsx";

/**
 * A component for a single bookmark
 *
 * @param props.data The BookmarkTreeNode with the data for the bookmark
 */
function Bookmark(props: {data: BookmarkTreeNode}) {
    let [favicon, setFavicon] = React.useState(GlobeIcon);
    useEffect(() => {
        // faviconURL(props.data.url).then(o => o && setFavicon(o))
        faviconURL(props.data).then(r => {
            if (r) {
                setFavicon(r);
            }
        })
    }, []);

    return(
        <a className="bookmark draggable" href={props.data.url}>
            <img alt="Bookmark icon" src={favicon}></img>
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

    let i = (await getBrowser().storage.local.get("icon-"+data.id))["icon-"+data.id];
    if (i) return i.toString()
    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", data.url!);
    if ((await fetch(url)).ok) {
        return url.toString();
    }
}

export default Bookmark;