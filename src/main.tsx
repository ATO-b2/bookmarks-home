import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./components/App.tsx";
import Context from "./components/Context.tsx";
import {OpenFoldersDAO} from "./persistance/OpenFolders.ts";
import {SettingsDAO} from "./persistance/Settings.ts";
import {IconAvalDAO} from "./persistance/IconAval.ts";
import {IconCacheDAO} from "./persistance/IconCache.ts";
import {BookmarkDAO} from "./persistance/Bookmarks.ts";

(window as any).__debug = { OpenFoldersDAO, IconCacheDAO, IconAvalDAO, SettingsDAO, BookmarkDAO }

createRoot(document.body).render(<Context><App/></Context>)