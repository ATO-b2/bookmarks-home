import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {useEffect, useState} from "react";
import {getBrowser} from "../main.tsx";
import BMIcon from "./BMIcon.tsx";
import Check from "../assets/check.svg?react"
import {IconCacheEntry, toDataURL} from "../Icons.ts";

interface IIconOption {
    url: string,
    source: "google" | "site" | "custom"
}

function IconPicker(props: {bmData: BookmarkTreeNode}) {
    const [iconOptions, setIconOptions] = useState<IIconOption[]>([]);
    const [iconCache, setIconCache] = useState<IconCacheEntry | undefined>(undefined);

    useEffect(() => {
        getBrowser().storage.local.get("icon-cache-"+props.bmData.id).then(r => {
            setIconCache(r["icon-cache-"+props.bmData.id]);
        });

        (async ()=>{
            let iconOptions2: IIconOption[] = [];

            const gURL = new URL('https://www.google.com/s2/favicons');
            gURL.searchParams.set("sz", "256");
            gURL.searchParams.set("domain_url", new URL(props.bmData.url!).origin);
            let gResponse = await fetch(gURL)
            if (gResponse) {
                iconOptions2.push({
                    url: gURL.toString(),
                    source: "google"
                })
            }

            let siteIcons: string[] = (await getBrowser().storage.local.get("icon-aval-"+props.bmData.id))["icon-aval-" + props.bmData.id]
            if (siteIcons) {
                iconOptions2.push(...siteIcons.map(ic => ({url: ic, source: "site"} as IIconOption)))
            }

            setIconOptions(iconOptions2);
        })()
    }, []);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length <= 0) {
            return;
        }
        let file = e.target.files[0];

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setIconOptions([...iconOptions, {url: reader.result, source: "custom"} as IIconOption])
        }
    }

    return (<>
        <div className={"icon-selector"}>
            {iconOptions &&
                iconOptions.map(i => <IconOption ico={i} isSelected={iconCache?.url == i.url} isSelectedAuto={false} id={props.bmData.id} />)
            }
        </div>
        <h4>Custom</h4>
        <input type={"file"} accept={"image/*"} className={"default"} name={"Upload"} onChange={handleImageUpload}/>
    </>)
}

function IconOption(props: {ico: IIconOption, isSelected: boolean, isSelectedAuto: boolean, id: string}) {

    async function handleClick() {
        await getBrowser().storage.local.set({["icon-cache-"+props.id]: {
                ...props.ico,
                data: await toDataURL(props.ico.url),
                setByUser: true
            } as IconCacheEntry})
    }

    return (
        <div className={"icon-option"} onClick={handleClick}>
            <BMIcon imgSrc={props.ico.url}/>
            {props.isSelected && <div className={"selected"}>
                <Check/>
            </div>}
        </div>
    )
}

export default IconPicker;