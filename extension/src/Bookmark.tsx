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
    u = new URL(u).hostname.toString();
    // const url = new URL(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${u}&size=128`)
    const url = new URL('https://www.google.com/s2/favicons');
    url.searchParams.set("sz", "128");
    url.searchParams.set("domain_url", u);
    console.log(url);
    return url.toString();
}

export default Bookmark;