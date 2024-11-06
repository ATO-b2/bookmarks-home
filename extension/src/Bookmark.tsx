import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

function Bookmark(props: {data: BookmarkTreeNode}) {
    
    return(
        <a className="bookmark draggable" href={props.data.url}>
            <img alt="Bookmark icon" src={faviconURL(props.data.url)}></img>
            <span>{props.data.title}</span>
        </a>
    );
}

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