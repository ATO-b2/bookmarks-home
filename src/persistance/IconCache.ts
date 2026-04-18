import {getBrowser} from "../main.tsx";

interface IconCacheEntry {
    icon?: IconInfo,
    setByUser: boolean,
    source: "google" | "site" | "letter" | "custom"
}

interface IconInfo {
    url?: string,
    hash?: string
    data: string,
    size: number
}

let iconCacheDAO = {
    get: async (id: string): Promise<IconCacheEntry | undefined> => {
        let data = Object.values(await getBrowser().storage.local.get(`icon-cache-${id}`)).at(0);
        return data ? JSON.parse(data) : undefined;
    },
    put: async (id: string, entry: IconCacheEntry) => {
        let data = JSON.stringify(entry);
        return await getBrowser().storage.local.set({[`icon-cache-${id}`]: data});
    }
};

export {iconCacheDAO, type IconCacheEntry, type IconInfo};