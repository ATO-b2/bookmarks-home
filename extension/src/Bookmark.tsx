import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

function Bookmark(props: {data: BookmarkTreeNode}) {
    return(
        <a className="bookmark" href={props.data.url}>
            <img alt="Bookmark icon" src={faviconURL(props.data.url)}></img>
            <span>{props.data.title}</span>
        </a>
    );
}

function faviconURL(u: string | undefined) {
    if (!u) return "";
    u = new URL(u).origin.toString();
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    return url.toString();
}

export default Bookmark;