import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./components/App.tsx";
import Context from "./components/Context.tsx";
import {OpenFoldersDAO} from "./persistance/OpenFolders.ts";
import {SettingsDAO} from "./persistance/Settings.ts";
import {IconAvalDAO} from "./persistance/IconAval.ts";
import {IconCacheDAO} from "./persistance/IconCache.ts";

(window as any).__debug = { OpenFoldersDAO, IconCacheDAO, IconAvalDAO, SettingsDAO }

export function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

export function getBrowserName() {
    return typeof browser === "undefined" ? "firefox" : "chrome";
}

createRoot(document.body).render(<Context><App/></Context>)