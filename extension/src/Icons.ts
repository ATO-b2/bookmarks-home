import {getBrowser} from "./main.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

interface IconCacheEntry {
    url?: string,
    data: string,
    setByUser: boolean,
    source: "google" | "site" | "custom"
}

async function getIcon(bmData: BookmarkTreeNode, setIcon: (icon: string) => void) {
    let cache: IconCacheEntry = (await getBrowser().storage.local.get("icon-cache-" + bmData.id))["icon-cache-" + bmData.id];

    if (cache) {
        // if there is an icon in the cache, set that
        setIcon(cache.data);
        if (cache.setByUser) {
            // if the user was the one who set the icon, then quit
            return;
        }

        if (cache.source === "google") {
            await iconFromSite(bmData, setIcon);
        }
    } else {
        iconFromSite(bmData, setIcon).catch(() => {
            iconFromGoogle(bmData, setIcon);
        })
    }
}

async function iconFromGoogle(bmData: BookmarkTreeNode, setIcon: (icon: string) => void) {
    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", new URL(bmData.url!).origin);
    let resp = await fetch(url)
    if (!resp.ok) {
        return Promise.reject();
    }
    let r =  url.toString()
    setIcon(r);
    let newCache: IconCacheEntry = {
        url: r,
        data: await toDataURL(r),
        setByUser: false,
        source: "google"
    }
    await getBrowser().storage.local.set({["icon-cache-" + bmData.id]: newCache})
}

async function iconFromSite(bmData: BookmarkTreeNode, setIcon: (icon: string) => void) {
    let icons_aval: string[] = (await getBrowser().storage.local.get("icon-aval-" + bmData.id))["icon-aval-" + bmData.id];
    if (!(icons_aval && icons_aval.length > 0)) {
        return Promise.reject()
    }
    let r = icons_aval[0];
    // set the icon and update the cache
    setIcon(r);
    let newCache: IconCacheEntry = {
        url: r,
        data: await toDataURL(r),
        setByUser: false,
        source: "site"
    }
    await getBrowser().storage.local.set({["icon-cache-" +bmData.id]: newCache})
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

export {type IconCacheEntry, getIcon, toDataURL}