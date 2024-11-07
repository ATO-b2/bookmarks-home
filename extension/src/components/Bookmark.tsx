import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

/**
 * A component for a single bookmark
 *
 * @param props.data The BookmarkTreeNode with the data for the bookmark
 */
function Bookmark(props: {data: BookmarkTreeNode}) {
    return(
        <a className="bookmark draggable" href={props.data.url}>
            <img alt="Bookmark icon" src={faviconURL(props.data.url)}></img>
            <span>{props.data.title}</span>
        </a>
    );
}

/**
 * Gets the icon for a bookmark
 *
 * @param u The URL of the link
 * @return The URL of the icon
 */
function faviconURL(u: string | undefined) {
    if (!u) return "";
    u = new URL(u).hostname.toString();
    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "256");
    // u = u.split(".")[u.split(".").length-2] +"."+ u.split(".")[u.split(".").length-1]
    url.searchParams.set("domain_url", u);
    return url.toString();

}

export default Bookmark;