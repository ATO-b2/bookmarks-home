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
    let remove = (_: string, moveInfo: _OnRemovedRemoveInfo) => {
        if (moveInfo.parentId !== id) return;
        action();
    }
    let move = (_: string, moveInfo: OnMovedInfo) => {
        if (moveInfo.parentId !== id && moveInfo.oldParentId !== id ) return;
        action();
    }
    let create = (_: string, moveInfo: BookmarkTreeNode) => {
        if (moveInfo.parentId !== id) return;
        action();
    }

    getBrowser().bookmarks.onRemoved.addListener(remove)
    getBrowser().bookmarks.onMoved.addListener(move)
    getBrowser().bookmarks.onCreated.addListener(create)

    const deregister = () => {
        getBrowser().bookmarks.onRemoved.removeListener(remove)
        getBrowser().bookmarks.onMoved.removeListener(move)
        getBrowser().bookmarks.onCreated.removeListener(create)
    };

    return { deregister }
}

function registerBookmarkChangedListener(id: string, action: () => void) {
    let change = (id2: string) => {
        if (id2 !== id) return;
        action();
    }

    getBrowser().bookmarks.onChanged.addListener(change);

    let deregister = () => getBrowser().bookmarks.onChanged.removeListener(change);

    return { deregister }
}

export { registerBookmarkChildrenChangedListener, registerBookmarkChangedListener }