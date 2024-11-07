import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import Bookmark from "./Bookmark.tsx";
import FolderButton from "./FolderButton.tsx";
import {useContext} from "react";
import {Settings} from "./Body.tsx";

/**
 * A component that displays the contents of a bookmark folder
 *
 * @param props.data The BookmarkTreeNode with data for the folder
 * @constructor
 */
function FolderBody (props: {data: BookmarkTreeNode}) {
    const [settings, _] = useContext(Settings)

    if (!props.data.children) return;

    let content = [...props.data.children].sort(getSortFunction(settings.sort))
    if (settings.foldersFirst) {
        let [bookmarks, folders] = separateFolders(content)
        content = folders.concat(bookmarks)
    }

    return (
        <div className={"folderBody"}>
            {content.map(child =>
                child.children
                    ? <FolderButton data={child} />
                    : <Bookmark data={child} />
            )}
        </div>
    )
}

/**
 * Gets the correct sort function based on the sort setting
 * @param sort The sort setting state
 * @return The corresponding sort function
 */
function getSortFunction(sort: "from-bookmarks" | "alphabetical" | "recent"): ((a:BookmarkTreeNode, b:BookmarkTreeNode) => number) | undefined {
    switch (sort) {
        case "alphabetical": return (a, b) => {
            return a.title.localeCompare(b.title);
        }
        case "recent": return (a, b) => {
            // @ts-ignore
            return a.dateLastUsed - b.dateLastUsed
        }
    }
}

/**
 * Separate the folders and the bookmarks into two separate lists
 * @param content THe bookmark list
 * @returns tuple in the format [bookmarks, folders]
 */
function separateFolders(content: BookmarkTreeNode[]) {
    let bookmarks = [];
    let folders = [];
    for (let bookmarkTreeNode of content) {
        if (bookmarkTreeNode.children) {
            folders.push(bookmarkTreeNode)
        } else {
            bookmarks.push(bookmarkTreeNode)
        }
    }
    return [bookmarks, folders]
}



export default FolderBody;