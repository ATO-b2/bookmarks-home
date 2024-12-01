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
    let url = new URL(data.url!).origin.toString();
    let response = (await getBrowser().storage.local.get("icon-cache-"+data.id))["icon-cache-"+data.id];
    if (response) return response;

    let imgData = await getFavicon(url);
    console.log("imgdata", imgData)
    if (imgData) {
        await getBrowser().storage.local.set({["icon-cache-"+data.id]: imgData});
        return imgData;
    }
}

async function getFavicon(url: string) {
    // get html from service worker
    let response = await chrome.runtime.sendMessage(url)
    if (!response) {
        console.log("failed to fetch site", url);
        return;
    }

    // parse html
    let parser = new DOMParser();
    let doc = parser.parseFromString(response, 'text/html');

    // locate best icons
    const tagTypes = ["apple-touch-icon", "shortcut icon", "icon"]
    let icons =  Array.from(doc.getElementsByTagName("link"))
        .filter(elem => tagTypes.includes(elem.rel))
        .sort((a, b) => {
            function compareTags() {
                // ascending
                return tagTypes.indexOf(a.rel) - tagTypes.indexOf(b.rel);
            }
            function compareSizes() {
                function getSize(elem: any) {
                    try { return Number(elem.sizes[0].split('x')[0]); }
                    catch { return 0; }
                }
                // descending
                return getSize(b) - getSize(a);
            }

            return compareSizes() || compareTags()
        })
        .map(elem => {
            const extUrl = getBrowser().runtime.getURL("");
            return elem.href.replace(extUrl, url + "/");
        });
    if (icons.length <= 0) {
        console.log("did not find icon on", url)
        return;
    }

    // encode icon
    let imgData = toDataURL(icons[0]);
    return imgData;
}

async function toDataURL(url: string): Promise<string> {
    try {
        let response = await fetch(url);
        let blob = await response.blob();
        let res = await new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
        return res!.toString();
    } catch (ex) {
        console.log("Failed ToDataURL", url, ex);
        return "";
    }
}

export default Bookmark;