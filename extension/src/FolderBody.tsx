import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import Bookmark from "./Bookmark.tsx";
import FolderButton from "./FolderButton.tsx";

function FolderBody (props: {data: BookmarkTreeNode}) {
    return (
            <div className={"folderBody"}>
                {
                    props.data.children &&
                    props.data.children.map(child =>
                        child.children
                            ? <FolderButton data={child} />
                            : <Bookmark data={child} />
                    )
                }
            </div>
    )
}

export default FolderBody;