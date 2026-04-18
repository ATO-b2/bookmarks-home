import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {ReactNode, useEffect, useState} from "react";
import {AutoBookmarkIcon, LetterBookmarkIcon} from "./BookmarkIcon.tsx";
import Check from "../assets/check.svg?react"
import {dao, IconAvalEntry, IconCacheEntry, toDataURL} from "../Icons.ts";

function IconPicker(props: {bmData: BookmarkTreeNode}) {
    const [iconsAval, setIconsAval] = useState<IconAvalEntry[]>([]);
    const [iconCache, setIconCache] = useState<IconCacheEntry | undefined>(undefined);

    let refreshData = () => {
        dao.iconAval.get(props.bmData.id).then(r => r && setIconsAval(r))
        dao.iconCache.get(props.bmData.id).then(r => r && setIconCache(r))
    }

    useEffect(() => {
        refreshData();
    }, []);

    // function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    //     if (!e.target.files || e.target.files.length <= 0) {
    //         return;
    //     }
    //     let file = e.target.files[0];
    //
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         setIconOptions([...iconOptions, {url: reader.result, source: "custom"} as IIconOption])
    //     }
    // }

    let handleSelectIcon = async (i: IconAvalEntry) => {
        await dao.iconCache.put(props.bmData.id, {
            icon: {
                url: i.url,
                data: await toDataURL(i.url),
                size: i.size
            },
            setByUser: true,
            source: 'site'
        })
        refreshData();
    }

    let handleSelectLetter = async () => {
        await dao.iconCache.put(props.bmData.id, {
            icon: undefined,
            setByUser: true,
            source: "letter"
        })
        refreshData();
    }

    return (<>
        <div className={"icon-selector"}>
            {iconsAval.map(i =>
                <IconOption
                    isSelected={iconCache?.icon?.url == i.url}
                    onSelect={() => handleSelectIcon(i)}
                >
                    <AutoBookmarkIcon imgSrc={i.url} size={i.size}/>
                </IconOption>
            )}
            <IconOption
                isSelected={!iconCache?.icon}
                onSelect={handleSelectLetter}
            >
                <LetterBookmarkIcon text={new URL(props.bmData.url!).hostname}/>
            </IconOption>
        </div>
        {/*<h4>Custom</h4>*/}
        {/*<input type={"file"} accept={"image/*"} className={"default"} name={"Upload"} onChange={handleImageUpload}/>*/}
    </>)
}

function IconOption(props: {children: ReactNode, isSelected: boolean, onSelect: () => void}) {
    return (
        <div className={"icon-option"} onClick={props.onSelect}>
            {props.children}
            {props.isSelected && <div className={"selected"}>
                <Check/>
            </div>}
        </div>
    )
}

export default IconPicker;