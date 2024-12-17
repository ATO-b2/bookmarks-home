import {getBrowser} from "./main.tsx";

export interface ISettings {
    sort: "from-bookmarks" | "alphabetical" | "recent"
    foldersFirst: boolean
    backgroundMode: "theme" | "color" | "image"
    backgroundColor: string
    backgroundImage: string
    foregroundColor: string
    editMode: boolean
    rootFolder: string | null
    keepFoldersOpen: boolean
}

export let defaultSettings: ISettings = {
    sort: "from-bookmarks",
    foldersFirst: true,
    backgroundMode: "theme",
    backgroundColor: "#000000",
    backgroundImage: "",
    foregroundColor: "#FFFFFF",
    editMode: false,
    rootFolder: '0',
    keepFoldersOpen: false
}

export function loadSettings(): Promise<ISettings> {
    // @ts-ignore
    let tmp: Promise<ISettings> = getBrowser().storage.sync.get(defaultSettings);
    tmp.then(j => console.log(j))
    return tmp;
}

export function writeSettings(settings: ISettings) {
    getBrowser().storage.sync.set(settings);
}

