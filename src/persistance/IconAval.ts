// NOTE: Used externally
import {getBrowser} from "../main.tsx";

interface IconAvalEntry {
    url: string,
    size: number
}

class IconAvalDAO {
    private static readonly KEY = (id: string) => `icon-aval-${id}`

    static async get(id: string): Promise<IconAvalEntry[] | undefined> {
        let data = Object.values(await getBrowser().storage.local.get(this.KEY(id))).at(0)
        return data ? JSON.parse(data) : undefined
    }
}

export {IconAvalDAO, type IconAvalEntry}