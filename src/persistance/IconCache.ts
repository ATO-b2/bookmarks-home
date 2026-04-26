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
    private static readonly KEY = (id: string) => `icon-cache-${id}`

    private static changeListeners: ((id: string) => void)[] = [];

    static async get(id: string): Promise<IconCacheEntry | undefined> {
        let data = Object.values(await getBrowser().storage.local.get(this.KEY(id))).at(0);
        return data ? JSON.parse(data) : undefined;
    }

    static async put(id: string, entry: IconCacheEntry) {
        let data = JSON.stringify(entry);
        let r = await getBrowser().storage.local.set({[this.KEY(id)]: data});
        this.changeListeners.forEach(ch => ch(id));
        return r;
    }

    static registerChangedListener(id: string, action: () => void) {
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

export {IconCacheDAO, type IconCacheEntry, type IconInfo};