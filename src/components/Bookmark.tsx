import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {useEffect, useState} from "react";
import {getBrowser} from "../main.tsx";
import {ActiveDrag, Settings} from "./Context.tsx";
import DropTargets from "./DropTargets.tsx";
import ContextMenu from "./ContextMenu.tsx";
import {BookmarkIcon} from "./BookmarkIcon.tsx";
import {registerBookmarkChangedListener} from "../util/bookmarkUtils.ts";

/**
 * A component for a single bookmark
 */
function Bookmark(props: {id: string}) {
    let [settings] = React.useContext(Settings);
    let [, setActiveDrag] = React.useContext(ActiveDrag);

    const [bmData, setBmData] = useState<BookmarkTreeNode | undefined>()

    useEffect(() => {
        let updateBookmark = () => {
            getBrowser().bookmarks.get(props.id).then(r => {
                setBmData(r[0]);
            })
        }
        updateBookmark();
        let changeListener = registerBookmarkChangedListener(props.id, updateBookmark);

        return () => changeListener.deregister();
    }, []);

    if (!bmData) return;

    return(
        <div className={"bookmark"} id={bmData.id}>
            <a
                href={bmData.url}
                draggable={settings.enableDragging}
                onDragStart={() => setActiveDrag(bmData)}
                onDragEnd={() => setActiveDrag(null)}
            >
                <BookmarkIcon bmData={bmData}/>
                <span>{bmData.title}</span>
            </a>
            <ContextMenu bmData={bmData}/>
            <DropTargets bmData={bmData}/>
        </div>
    );
}

export default Bookmark;