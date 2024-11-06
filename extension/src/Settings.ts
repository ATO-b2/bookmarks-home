import {getBrowser} from "./main.tsx";

export interface ISettings {
    sort: "from-bookmarks" | "alphabetical" | "frequency" | "recent"
    foldersFirst: boolean
    backgroundMode: "theme" | "color" | "image"
    backgroundColor: string
    backgroundImage: string
    editMode: boolean
    rootFolder: string | null
}

export let defaultSettings: ISettings = {
    sort: "from-bookmarks",
    foldersFirst: true,
    backgroundMode: "theme",
    backgroundColor: "#000000",
    backgroundImage: "",
    editMode: false,
    rootFolder: '0',
}

export function loadSettings(): Promise<ISettings> {
    // @ts-ignore
    return getBrowser().storage.local.get(defaultSettings)
}

export function writeSettings(settings: ISettings) {
    getBrowser().storage.local.set(settings);
}

