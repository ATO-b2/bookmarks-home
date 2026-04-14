import { createRoot } from 'react-dom/client'
import './index.css'
import Body from "./components/Body.tsx";
import Context from "./components/Context.tsx";

export function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

createRoot(document.body).render(<Context><Body/></Context>)