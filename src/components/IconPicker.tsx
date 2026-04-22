import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {AutoBookmarkIcon, LetterBookmarkIcon} from "./BookmarkIcon.tsx";
import Check from "../assets/check.svg?react"
import {fileToDataUrl, getImageDimensions, hashImage, urlToDataUrl} from "../util/IconUtils.ts";
import {iconAvalDAO, IconAvalEntry} from "../persistance/IconAval.ts";
import {iconCacheDAO, IconCacheEntry} from "../persistance/IconCache.ts";

interface ImageUploadInfo {
    data: string,
    size: number,
    hash: string
}

interface GoogleIconInfo extends IconAvalEntry {}

function IconPicker(props: {bmData: BookmarkTreeNode}) {
    const [iconsAval, setIconsAval] = useState<IconAvalEntry[]>([]);
    const [iconCache, setIconCache] = useState<IconCacheEntry | undefined>(undefined);
    const [uploadedImages, setUploadedImages] = useState<ImageUploadInfo[]>([])
    const [googleIcon, setGoogleIcon] = useState<GoogleIconInfo | undefined>(undefined)

    const uploadedImagesWasInit = useRef(false)

    let refreshData = () => {
        getGoogleIcon(props.bmData).then(r => r && setGoogleIcon(r))
        iconAvalDAO.get(props.bmData.id).then(r => r && setIconsAval(r))
        iconCacheDAO.get(props.bmData.id).then(r => r && setIconCache(r))
    }

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        if (iconCache && !uploadedImagesWasInit.current) {
            if (iconCache?.source === 'custom') {
                setUploadedImages([{
                    data: iconCache.icon!.data,
                    size: iconCache.icon!.size,
                    hash: iconCache.icon!.hash!
                }])
            }
            uploadedImagesWasInit.current = true;
        }
    }, [iconCache]);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        if (!e.target.files || !e.target.files.length) {
            return;
        }
        let file = e.target.files[0];

        let data = await fileToDataUrl(file);
        let r = {
            data,
            size: (await getImageDimensions(data)).width,
            hash: await hashImage(data)
        }
        setUploadedImages([...uploadedImages, r])
    }

    let handleSelectIcon = async (i: IconAvalEntry) => {
        await iconCacheDAO.put(props.bmData.id, {
            icon: {
                url: i.url,
                data: await urlToDataUrl(i.url),
                size: i.size
            },
            setByUser: true,
            source: 'site'
        })
        refreshData();
    }

    let handleSelectLetter = async () => {
        await iconCacheDAO.put(props.bmData.id, {
            icon: undefined,
            setByUser: true,
            source: "letter"
        })
        refreshData();
    }

    let handleSelectCustom = async (i: ImageUploadInfo) => {
        await iconCacheDAO.put(props.bmData.id, {
            icon: {
                data: i.data,
                hash: i.hash,
                size: i.size
            },
            setByUser: true,
            source: 'custom'
        })
        refreshData();
    }

    let handleSelectGoogle = async () => {
        await iconCacheDAO.put(props.bmData.id, {
            icon: {
                data: await urlToDataUrl(googleIcon!.url),
                url: googleIcon!.url,
                size: googleIcon!.size
            },
            setByUser: true,
            source: "google"
        })
        refreshData();
    }

    return (<>
        <div className={"icon-selector"}>
            <IconOption
                isSelected={!iconCache?.icon}
                onSelect={handleSelectLetter}
            >
                <LetterBookmarkIcon text={new URL(props.bmData.url!).hostname}/>
            </IconOption>
            {googleIcon && (
                <IconOption
                    isSelected={iconCache?.icon?.url === googleIcon.url}
                    onSelect={handleSelectGoogle}
                >
                    <AutoBookmarkIcon imgSrc={googleIcon.url} size={googleIcon.size}/>
                </IconOption>
            )}
            {iconsAval.map(i =>
                <IconOption
                    isSelected={iconCache?.icon?.url === i.url}
                    onSelect={() => handleSelectIcon(i)}
                >
                    <AutoBookmarkIcon imgSrc={i.url} size={i.size}/>
                </IconOption>
            )}
            {uploadedImages.map(i =>
                <IconOption
                    isSelected={iconCache?.icon?.hash === i.hash}
                    onSelect={() => handleSelectCustom(i)}
                >
                    <AutoBookmarkIcon imgSrc={i.data} size={i.size}/>
                </IconOption>
            )}
        </div>
        <h4>Custom</h4>
        <input type={"file"} accept={"image/*"} className={"default"} name={"Upload"} onChange={handleImageUpload}/>
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

async function getGoogleIcon(bmData: BookmarkTreeNode): Promise<GoogleIconInfo | undefined> {
    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    url.searchParams.set("domain_url", new URL(bmData.url!).origin);
    let resp = await fetch(url)
    if (!resp.ok) {
        return undefined;
    }
    let r = url.toString()
    return {
        url: r,
        size: (await getImageDimensions(r)).width
    }
}

export default IconPicker;