import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import FolderBody from "./FolderBody.tsx";
import folderIcon from "./assets/folder.svg"
import folderIconOpen from "./assets/folder_open.svg"
import {useState} from "react";

function FolderButton(props: {data: BookmarkTreeNode}) {

    const [folderOpen, setFolderOpen] = useState(false);

    return(
        <>
            <a className={"bookmark draggable"} onClick={() => setFolderOpen(!folderOpen)}>
                <img alt="Folder icon" src={folderOpen ? folderIconOpen : folderIcon}/>
                <span>{props.data.title}</span>
            </a>
            { folderOpen
                && props.data.children
                && props.data.children.length > 0
                && (<FolderBody data={props.data}/>)}
        </>
);
}

export default FolderButton