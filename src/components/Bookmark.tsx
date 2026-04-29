import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import React, {useEffect, useState} from "react";
import {ActiveDrag, Settings} from "./Context.tsx";
import DropTargets from "./DropTargets.tsx";
import ContextMenu from "./ContextMenu.tsx";
import {BookmarkIcon} from "./BookmarkIcon.tsx";
import {BookmarkDAO} from "../persistance/Bookmarks.ts";

function Bookmark(props: {id: string}) {
    let [settings] = React.useContext(Settings);
    let [, setActiveDrag] = React.useContext(ActiveDrag);

    const [bmData, setBmData] = useState<BookmarkTreeNode | undefined>()

    useEffect(() => {
        let updateBookmark = () => {
            BookmarkDAO.get(props.id).then(r => setBmData(r))
        }
        updateBookmark();
        let changeListener = BookmarkDAO.registerOnChanged(props.id, updateBookmark);

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