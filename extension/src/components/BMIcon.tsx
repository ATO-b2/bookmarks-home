import React, {SyntheticEvent, useEffect} from "react";
import ColorThief from "colorthief";
import {getBrowser} from "../main.tsx";

function BMIcon (props: {url: string, id: string}) {

    let [favicon, setFavicon] = React.useState<string | null>(null);
    let [iconMode, setIconMode] = React.useState<"large" | "small" | "letter">("letter");
    let [bgColor, setBgColor] = React.useState<[number, number, number] | null>(null)
    let [bgColorPriority, setBgColorPriority] = React.useState(0);

    useEffect(() => {
        faviconURL(props).then(r => {
            if (r) {
                setFavicon(r)
                setIconMode("small");
            }
        })
    }, []);

    function handleImageLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        if (e.currentTarget.naturalWidth >= 75 || favicon!.startsWith("data:image/svg+xml")) {
            setIconMode("large")
        } else if(bgColorPriority < 2) {
            setBgColor(new ColorThief().getColor(e.currentTarget))
            setBgColorPriority(2);
        }
    }

    return (
        <div className={"icon-box " + (iconMode)}
             style={bgColor ? {"--icon-bg": `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.2)`} as React.CSSProperties : undefined}>
            {(() => {
                switch (iconMode) {
                    case "letter": {
                        let url = new URL(props.url);
                        if (bgColorPriority < 1) {
                            setBgColor(hashStringToColor(url.hostname));
                            setBgColorPriority(1);
                        }
                        return (<span className={"letter"}>{url.hostname.charAt(0)}</span>)
                    }
                    case "small": {
                        return (<img alt="Bookmark icon" src={favicon!} onLoad={handleImageLoad}/>)
                    }
                    case "large": {
                        return (<img alt="Bookmark icon" src={favicon!}/>)
                    }
                }
            })()}
        </div>
    )
}

/**
 * Gets the icon for a bookmark
 *
 * @param data The URL of the link
 * @return The URL of the icon
 */
async function faviconURL(data: {url: string, id:string}) {
    let i = (await getBrowser().storage.local.get("icon-cache-"+data.id))["icon-cache-"+data.id];
    if (i) return i
    // if (i == null) return i;

    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", data.url!);
    let resp = await fetch(url)
    let imgData = resp.ok ? await toDataURL(url.toString()) : null;
    getBrowser().storage.local.set({["icon-cache-"+data.id]: imgData});
    return imgData;
}

function toDataURL(url: string): string {
    // @ts-ignore
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))
}

function djb2(str: string){
    let hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
}

function hashStringToColor(str: string): [number, number, number] {
    let hash = djb2(str);
    let r = (hash & 0xFF0000) >> 16;
    let g = (hash & 0x00FF00) >> 8;
    let b = hash & 0x0000FF;
    return [r, g, b];
}

export default BMIcon;