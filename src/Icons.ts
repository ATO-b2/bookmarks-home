import {getBrowser} from "./main.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

interface IconCacheEntry {
    icon?: IconInfo,
    setByUser: boolean,
    source: "google" | "site" | "letter" | "custom"
}

export interface IconInfo {
    url?: string,
    hash?: string
    data: string,
    size: number
}

// NOTE: Used externally
interface IconAvalEntry {
    url: string,
    size: number
}

let dao = {
    iconCache: {
        get: async (id: string): Promise<IconCacheEntry | undefined> => {
            let data = Object.values(await getBrowser().storage.local.get(`icon-cache-${id}`)).at(0);
            return data ? JSON.parse(data) : undefined;
        },
        put: async (id: string, entry: IconCacheEntry) => {
            let data = JSON.stringify(entry);
            return await getBrowser().storage.local.set({[`icon-cache-${id}`]: data});
        }
    },
    iconAval: {
        get: async (id: string): Promise<IconAvalEntry[] | undefined> => {
            let data = Object.values(await getBrowser().storage.local.get("icon-aval-" + id)).at(0)
            return data ? JSON.parse(data) : undefined
        }
    }
}

async function getIconInfo(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    let cache = await dao.iconCache.get(bmData.id);

    if (cache) {
        return cache.icon;
    } else {
        return await bestIconFromSite(bmData);
    }
}

async function bestIconFromSite(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    let icons_aval = (await dao.iconAval.get(bmData.id));
    if (!icons_aval || !icons_aval.length) {
        return undefined
    }

    let iconAval = icons_aval[0];
    let iconInfo = {
        url: iconAval.url,
        data: await toDataURL(iconAval.url),
        size: iconAval.size
    }
    dao.iconCache.put(bmData.id, {
        icon: iconInfo,
        setByUser: false,
        source: "site"
    })
    return iconInfo;
}

async function iconFromGoogle(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", new URL(bmData.url!).origin);
    let resp = await fetch(url)
    if (!resp.ok) {
        return undefined;
    }
    let r = url.toString()
    let iconInfo = {
        url: r,
        data: await toDataURL(r),
        size: (await getImageDimensions(r)).width
    }
    dao.iconCache.put(bmData.id, {
        icon: iconInfo,
        setByUser: false,
        source: "google"
    })
    return iconInfo
}

async function toDataURL(url: string) {
    let response = await fetch(url);
    let blob: Blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as any)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    });
}

function getImageDimensions(url: string): Promise<{width: number, height: number}> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({width: img.naturalWidth, height: img.naturalHeight});
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}

export {type IconCacheEntry, type IconAvalEntry, getIconInfo, toDataURL, dao}