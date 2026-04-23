import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./components/App.tsx";
import Context from "./components/Context.tsx";

export function getBrowser() {
    return typeof browser === "undefined" ? chrome : browser;
}

createRoot(document.body).render(<Context><App/></Context>)