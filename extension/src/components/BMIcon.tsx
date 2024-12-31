import React, {SyntheticEvent, useEffect, useState} from "react";
import ColorThief from "colorthief";
import {getBrowser} from "../main.tsx";

function BMIcon(props: {imgSrc?: string, bmUrl?:string}) {

    let [iconMode, setIconMode] = React.useState<"large" | "small" | "letter">("large");
    let [bgColor, setBgColor] = React.useState<[number, number, number] | null>(null)

    function handleImageLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        if (e.currentTarget.naturalWidth < 75 && !props.imgSrc!.startsWith("data:image/svg+xml")) {
            setBgColor(new ColorThief().getColor(e.currentTarget));
            setIconMode("small");
        }
    }

    function handleImageError() {
        let url = new URL(props.bmUrl!);
        setBgColor(hashStringToColor(url.hostname))
        setIconMode("letter");
    }

    if (!props.imgSrc) {
        let url = new URL(props.bmUrl!);
        bgColor = hashStringToColor(url.hostname)
        iconMode = "letter"
    }

    return (
        <div className={"icon-box " + (iconMode)}
             style={bgColor ? {"--icon-bg": `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.2)`} as React.CSSProperties : undefined}>
            {(() => { switch (iconMode) {
                case "letter": {
                    return (<span className={"letter"}>{new URL(props.bmUrl!).hostname.charAt(0)}</span>)
                }
                case "small": {
                    return (<img alt="Bookmark icon" src={props.imgSrc}/>)
                }
                case "large": {
                    return (<img alt="Bookmark icon" src={props.imgSrc} onLoad={handleImageLoad} onError={handleImageError}/>)
                }
            }})()}
    </div>
    )
}

function hashStringToColor(str: string): [number, number, number] {
    let hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }

    let r = (hash & 0xFF0000) >> 16;
    let g = (hash & 0x00FF00) >> 8;
    let b = hash & 0x0000FF;
    return [r, g, b];
}

export default BMIcon;