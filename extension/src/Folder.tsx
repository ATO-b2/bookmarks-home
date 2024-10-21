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

// if (props.data.children) {
//     let l = [];
//     for (let child of props.data.children) {
//         if (child.children) {
//             l.push(<Folder data={child} />)
//         } else {
//             l.push(<Bookmark data={child} />)
//         }
//     }
//     return l
// }

export default Folder;