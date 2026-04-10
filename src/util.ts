import {getBrowser} from "./main.tsx";

import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import _OnRemovedRemoveInfo = browser.bookmarks._OnRemovedRemoveInfo;

interface OnMovedInfo {
    parentId: string
    index: number
    oldParentId: string
    oldIndex: number
}

function registerBookmarkChildrenChangedListener(id: string, action: () => void) {
    let a = (_: string, moveInfo: _OnRemovedRemoveInfo) => {
        if (moveInfo.parentId !== id) return;
        action();
    }
    let b = (_: string, moveInfo: OnMovedInfo) => {
        if (moveInfo.parentId !== id && moveInfo.oldParentId !== id ) return;
        action();
    }
    let c = (_: string, moveInfo: BookmarkTreeNode) => {
        if (moveInfo.parentId !== id) return;
        action();
    }

    getBrowser().bookmarks.onRemoved.addListener(a)
    getBrowser().bookmarks.onMoved.addListener(b)
    getBrowser().bookmarks.onCreated.addListener(c)

    const deregister = () => {
        getBrowser().bookmarks.onRemoved.removeListener(a)
        getBrowser().bookmarks.onMoved.removeListener(b)
        getBrowser().bookmarks.onCreated.removeListener(c)
    };

    return { deregister }
}

export { registerBookmarkChildrenChangedListener }