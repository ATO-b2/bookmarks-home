import {getBrowser} from "./main.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {RGBColor} from "colorthief";

interface IconCacheEntry {
    url?: string,
    data: string,
    setByUser: boolean,
    source: "google" | "site" | "custom"
}

async function getIcon(bmData: BookmarkTreeNode, setIcon: (icon: string) => void) {
    let id = bmData.id;
    let bmUrl = bmData.url!;
    let cache: IconCacheEntry = (await getBrowser().storage.local.get("icon-cache-" + id))["icon-cache-" + id];

    if (cache) {
        // if there is an icon in the cache, set that
        setIcon(cache.data);
        if (cache.setByUser) {
            // if the user was the one who set the icon, then quit
            return;
        }

        if (cache.source === "google") {
            // if the cached icon came from google check to see if iconGrabber found an icon
            iconFromSite(id).then(async r => {
                if (r) {
                    // set the icon and update the cache
                    let iconData = toDataURL(r);
                    setIcon(r);
                    let newCache: IconCacheEntry = {
                        url: r,
                        data: await iconData,
                        setByUser: false,
                        source: "site"
                    }
                    await getBrowser().storage.local.set({["icon-cache-" +id]: newCache})
                }
            })
        }
    } else {

        iconFromSite(id).then(async r => {
            if (r) {
                // set the icon and update the cache
                let iconData = toDataURL(r);
                setIcon(r);
                let newCache: IconCacheEntry = {
                    url: r,
                    data: await iconData,
                    setByUser: false,
                    source: "site"
                }
                await getBrowser().storage.local.set({["icon-cache-" +id]: newCache})
            } else {
                iconFromGoogle(bmUrl).then(async r => {
                    if (r) {
                        // set the icon and update the cache
                        let iconData = toDataURL(r);
                        setIcon(r);
                        let newCache: IconCacheEntry = {
                            url: r,
                            data: await iconData,
                            setByUser: false,
                            source: "google"
                        }
                        await getBrowser().storage.local.set({["icon-cache-" +id]: newCache})
                    }
                })
            }
        })
    }
}

async function iconFromGoogle(bmUrl: string): Promise<string | undefined> {
    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", bmUrl);
    let resp = await fetch(url)
    if (resp.ok) {
        return url.toString()
    }
}

async function iconFromSite(id: string): Promise<string | undefined> {
    let icons_aval: string[] = (await getBrowser().storage.local.get("icon-aval-" + id))["icon-aval-" + id];
    if (icons_aval && icons_aval.length > 0) {
        return icons_aval[0];
    }
}

async function toDataURL(url: string) {
    let response = await fetch(url);
    let blob: Blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        // @ts-ignore
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    });
}

export {type IconCacheEntry, getIcon}