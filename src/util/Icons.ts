import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {getGoogleIcon, urlToDataUrl} from "./IconUtils.ts";
import {IconCacheDAO, IconInfo} from "../persistance/IconCache.ts";
import {IconAvalDAO} from "../persistance/IconAval.ts";

async function getIconInfo(bmData: BookmarkTreeNode): Promise<IconInfo | undefined> {
    let cache = await IconCacheDAO.get(bmData.id);

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
    let icons_aval = (await IconAvalDAO.get(bmData.id));
    if (!icons_aval || !icons_aval.length) {
        return undefined
    }

    let iconAval = icons_aval[0];
    let iconInfo = {
        url: iconAval.url,
        data: await urlToDataUrl(iconAval.url),
        size: iconAval.size
    }
    IconCacheDAO.put(bmData.id, {
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
    IconCacheDAO.put(bmData.id, {
        icon: iconInfo,
        setByUser: false,
        source: "google"
    })
    return iconInfo
}

export { getIconInfo }