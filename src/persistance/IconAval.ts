// NOTE: Used externally
import {getBrowser} from "../main.tsx";

interface IconAvalEntry {
    url: string,
    size: number
}

let iconAvalDAO = {
    get: async (id: string): Promise<IconAvalEntry[] | undefined> => {
        let data = Object.values(await getBrowser().storage.local.get("icon-aval-" + id)).at(0)
        return data ? JSON.parse(data) : undefined
    }
};

export {iconAvalDAO, type IconAvalEntry}