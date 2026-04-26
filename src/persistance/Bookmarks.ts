import {getBrowser} from "../main.tsx";
import MoveDestination = chrome.bookmarks.MoveDestination;
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import _OnRemovedRemoveInfo = browser.bookmarks._OnRemovedRemoveInfo;

interface OnMovedInfo {
    parentId: string
    index: number
    oldParentId: string
    oldIndex: number
}

class BookmarkDAO {
    static async get(id: string) {
        return (await getBrowser().bookmarks.get(id)).at(0)
    }

    static async update(id: string, newData: {}) {
        return getBrowser().bookmarks.update(id, newData)
    }

    static async remove(id: string) {
        return getBrowser().bookmarks.remove(id)
    }

    static async removeFolder(id: string) {
        return getBrowser().bookmarks.removeTree(id)
    }

    static async move(id: string, destination: MoveDestination) {
        return getBrowser().bookmarks.move(id, destination)
    }

    static async getChildren(id: string) {
        let r = (await getBrowser().bookmarks.getSubTree(id)).at(0);
        return [...(r?.children ?? [])]
    }

    static async getAllFolders() {
        let tree = await getBrowser().bookmarks.getTree();
        let folderList: BookmarkTreeNode[] = [];
        rec(tree);

        function rec(tree: BookmarkTreeNode[]) {
            tree.forEach(item => {
                if (item.children) {
                    folderList.push(item);
                    rec(item.children);
                }
            })
        }
        return folderList;
    }

    static registerOnChanged(id: string, action: () => void) {
        let change = (id2: string) => {
            if (id2 !== id) return;
            action();
        }

        getBrowser().bookmarks.onChanged.addListener(change);

        let deregister = () => getBrowser().bookmarks.onChanged.removeListener(change);

        return { deregister }
    }

    static registerOnChildrenChanged(id: string, action: () => void) {
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
}

export {BookmarkDAO}