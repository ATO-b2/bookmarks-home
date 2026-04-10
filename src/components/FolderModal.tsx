import FolderBody from "./FolderBody.tsx";
import React, {RefObject, useEffect, useState} from "react";
import {getBrowser} from "../main.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

function FolderModal(props: {id: string, folderRef: RefObject<HTMLDivElement | null>, zIndex: number, onClose: () => void}) {
    const [viewportDims, setViewportDims] = useState<undefined | {x: number, y: number}>();
    const [children, setChildren] = useState<BookmarkTreeNode[]>([])

    useEffect(() => {
        let handleResize = () => setViewportDims({x: window.innerWidth, y: window.innerHeight});
        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        getBrowser().bookmarks.getSubTree(props.id).then(r => {
            setChildren([...r[0].children!])
        })
    }, []);

    if (!props.folderRef.current || !viewportDims || !children.length) return;

    let modalPosition = (() => {
        let folderButtonElem = props.folderRef.current;
        let itemWidth = /*folderButtonElem.offsetWidth*/ 145;
        let itemCount = children.length;
        let maxFolderWidth = viewportDims.x - /*folderButtonElem.getBoundingClientRect().left*/20;
        let maxItemsPerRow = Math.floor(maxFolderWidth / itemWidth)
        let itemsPerRow = Math.min(itemCount, maxItemsPerRow);
        let distanceAfterButton = (maxFolderWidth - folderButtonElem.getBoundingClientRect().left) + 20;
        let maxItemsAfterButton = Math.floor(distanceAfterButton / itemWidth);
        let itemsAfterButton = Math.min(itemCount, maxItemsAfterButton)
        let itemsBeforeButton = (itemsPerRow - itemsAfterButton)
        return {
            width: itemWidth * itemsPerRow + 4,
            top: folderButtonElem.offsetTop + folderButtonElem.offsetHeight,
            left: folderButtonElem.offsetLeft - itemsBeforeButton * itemWidth - 11
        };
    })();

    return (
        <>
            <div
                className="folder-modal-overlay"
                style={{zIndex: props.zIndex}}
                onClick={props.onClose}
            />
            <div
                className="folder-modal"
                style={{
                    top: modalPosition.top,
                    left: modalPosition.left,
                    width: modalPosition.width,
                    zIndex: props.zIndex + 1
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <FolderBody id={props.id}/>
            </div>
        </>
    );
}

export default FolderModal