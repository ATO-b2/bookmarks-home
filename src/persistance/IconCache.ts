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

class IconCacheDAO {
    private changeListeners: ((id: string) => void)[] = [];

    async get(id: string): Promise<IconCacheEntry | undefined> {
        let data = Object.values(await getBrowser().storage.local.get(`icon-cache-${id}`)).at(0);
        return data ? JSON.parse(data) : undefined;
    }

    async put(id: string, entry: IconCacheEntry) {
        let data = JSON.stringify(entry);
        let r = await getBrowser().storage.local.set({[`icon-cache-${id}`]: data});
        this.changeListeners.forEach(ch => ch(id));
        return r;
    }

    registerChangedListener(id: string, action: () => void) {
        let change = (cId: string) => {
            if (id !== cId) return;
            action();
        }

        this.changeListeners.push(change)

        const deregister = () => {
            this.changeListeners = this.changeListeners.filter(i => i === change)
        }

        return { deregister }
    }
}

let iconCacheDAO = new IconCacheDAO();

export {iconCacheDAO, type IconCacheEntry, type IconInfo};