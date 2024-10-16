import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
import Bookmark from "./Bookmark.tsx";

function Folder (props: {data: BookmarkTreeNode}) {
    return (
        <div className="folder">
            <span>{props.data.title}</span>
            <div>
                {
                    props.data.children &&
                    props.data.children.map(child =>
                        child.children
                            ? <Folder data={child} />
                            : <Bookmark data={child} />
                    )
                }
            </div>
        </div>
    )
}

export default Folder;