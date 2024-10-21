import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import Bookmark from "./Bookmark.tsx";

function Folder (props: {data: BookmarkTreeNode}) {
    return (
        <details open className="folder">
            <summary>{props.data.title}</summary>
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
        </details>
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