import {getBrowser} from "../main.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {getImageDimensions, UrlToDataUrl} from "./IconUtils.ts";
import {iconCacheDAO, IconInfo} from "../persistance/IconCache.ts";
import {iconAvalDAO} from "../persistance/IconAval.ts";

async function getIconInfo(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    let cache = await iconCacheDAO.get(bmData.id);

    if (cache) {
        return cache.icon;
    } else {
        return await bestIconFromSite(bmData);
    }
}

async function bestIconFromSite(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    let icons_aval = (await iconAvalDAO.get(bmData.id));
    if (!icons_aval || !icons_aval.length) {
        return undefined
    }

    let iconAval = icons_aval[0];
    let iconInfo = {
        url: iconAval.url,
        data: await UrlToDataUrl(iconAval.url),
        size: iconAval.size
    }
    iconCacheDAO.put(bmData.id, {
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
        data: await UrlToDataUrl(r),
        size: (await getImageDimensions(r)).width
    }
    iconCacheDAO.put(bmData.id, {
        icon: iconInfo,
        setByUser: false,
        source: "google"
    })
    return iconInfo
}

export { getIconInfo }