import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {getGoogleIcon, urlToDataUrl} from "./IconUtils.ts";
import {iconCacheDAO, IconInfo} from "../persistance/IconCache.ts";
import {iconAvalDAO} from "../persistance/IconAval.ts";

async function getIconInfo(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    let cache = await iconCacheDAO.get(bmData.id);

    if (!cache) {
        return await bestIconFromSite(bmData) || await iconFromGoogle(bmData)
    }

    if (!cache.setByUser) {
        let r = await bestIconFromSite(bmData)
        if (r) return r;
    }

    return cache.icon;
}

async function bestIconFromSite(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    let icons_aval = (await iconAvalDAO.get(bmData.id));
    if (!icons_aval || !icons_aval.length) {
        return undefined
    }

    let iconAval = icons_aval[0];
    let iconInfo = {
        url: iconAval.url,
        data: await urlToDataUrl(iconAval.url),
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
    let googleIcon = await getGoogleIcon(bmData.url!)
    if (!googleIcon) {
        return undefined
    }

    let iconInfo = {
        data: await urlToDataUrl(googleIcon.url),
        url: googleIcon.url,
        size: googleIcon.size
    }
    iconCacheDAO.put(bmData.id, {
        icon: iconInfo,
        setByUser: false,
        source: "google"
    })
    return iconInfo
}

export { getIconInfo }