import {getBrowser} from "./main.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

interface IconCacheEntry {
    url?: string,
    data: IconInfo,
    setByUser: boolean,
    source: "google" | "site" | "custom"
}

export interface IconInfo {
    src: string,
    size: number
}

interface IconAvalEntry {
    url: string,
    size: number
}

// let iconAvalEntryToInfo = async (iae: IconAvalEntry): Promise<IconInfo> => {
//     return {
//         size: iae.size,
//         src: await toDataURL(iae.url)
//     }
// }

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
        return cache.data;
    } else {
        return await bestIconFromSite(bmData);
    }
}

// async function iconFromGoogle(bmData: BookmarkTreeNode) {
//     const url = new URL('https://www.google.com/s2/favicons');
//     url.searchParams.set("sz", "256");
//     url.searchParams.set("domain_url", new URL(bmData.url!).origin);
//     let resp = await fetch(url)
//     if (!resp.ok) {
//         return undefined;
//     }
//     let r = url.toString()
//     let newCache: IconCacheEntry = {
//         url: r,
//         data: await toDataURL(r),
//         setByUser: false,
//         source: "google"
//     }
//
// }

async function bestIconFromSite(bmData: BookmarkTreeNode) {
    let icons_aval = (await dao.iconAval.get(bmData.id));
    if (!icons_aval || !icons_aval.length) {
        return undefined
    }

    let k = icons_aval[0];
    let r = {
        src: await toDataURL(k.url),
        size: k.size
    }
    dao.iconCache.put(bmData.id, {
        url: k.url,
        data: r,
        setByUser: false,
        source: "site"
    })
    return r;
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

export {type IconCacheEntry, getIconInfo, toDataURL}