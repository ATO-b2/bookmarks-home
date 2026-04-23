import {getBrowser} from "../main.tsx";

export interface ISettings {
    sort: "from-bookmarks" | "alphabetical" | "recent",
    foldersFirst: boolean,
    foregroundColor: string,
    backgroundColor: string,
    modalForegroundColor: string,
    modalBackgroundColor: string,
    modalBorderColor: string,
    enableDragging: boolean,
    editMode: boolean,
    rootFolder: string | null,
    keepFoldersOpen: boolean
}

export let defaultSettings: ISettings = {
    sort: "from-bookmarks",
    foldersFirst: true,
    foregroundColor: 'white',
    backgroundColor: 'rgb(36, 36, 36)',
    modalForegroundColor: 'white',
    modalBackgroundColor: 'rgba(25, 25, 25)',
    modalBorderColor: 'rgba(255, 255, 255, 0.2)',
    enableDragging: true,
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

