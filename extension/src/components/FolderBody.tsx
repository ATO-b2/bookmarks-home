import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import {useContext, useEffect, useState} from "react";
import {Settings} from "./Body.tsx";
import {getBrowser} from "../main.tsx";
import Bookmark from "./Bookmark.tsx";
import FolderButton from "./FolderButton.tsx";

/**
 * A component that displays the contents of a bookmark folder
 */
function FolderBody (props: {id: string}) {

    const [settings, ] = useContext(Settings)

    const [children, setChildren] = useState<BookmarkTreeNode[]>([])

    const updateBookmarks = () => {
        getBrowser().bookmarks.getSubTree(props.id).then(r => {
            let content = [...r[0].children!].sort(getSortFunction(settings.sort))
            if (settings.foldersFirst) {
                let [bookmarks, folders] = separateFolders(content)
                content = folders.concat(bookmarks)
            }
            setChildren(content);
        })
    }

    useEffect(() => {
        updateBookmarks();
        // getBrowser().bookmarks.onRemoved.addListener((id: string, moveInfo) => {
        //     if (moveInfo.parentId !== props.id) return;
        //     updateBookmarks();
        // })
    }, []);

    useEffect(() => {
        updateBookmarks();
    }, [settings]);

    return (
        <div className={"folderBody"}>
            {children.map(child =>
                child.children
                    ? <FolderButton id={child.id} />
                    : <Bookmark id={child.id} />
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