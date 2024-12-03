import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderBody from "./FolderBody.tsx";
import FolderIcon from "../assets/folder.svg?react"
import FolderIconOpen from "../assets/folder_open.svg?react"
import {useState} from "react";
import bookmark from "./Bookmark.tsx";

/**
 * A component for the button used to open a bookmark folder.
 * This is themed the same as a bookmark
 *
 * @param props.data The BookmarkTreeNode containing the data of the folder
 */
function FolderButton(props: {data: BookmarkTreeNode}) {
    const [folderOpen, setFolderOpen] = useState(false);

    return(
        <>
            <div className={"bookmark"}>
                <a onClick={() => setFolderOpen(!folderOpen)}>
                    <div className="icon-box">
                        {folderOpen ? <FolderIconOpen/> : <FolderIcon/>}
                    </div>
                    <span>{props.data.title}</span>
                </a>
            </div>
            {folderOpen
            && props.data.children
            && props.data.children.length > 0
            && (<FolderBody data={props.data}/>)}
        </>
);
}

export default FolderButton