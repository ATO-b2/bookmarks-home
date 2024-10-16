interface BookmarkProps {
    name: string;
    url: string;
    icon: string;
}

function Bookmark(props: BookmarkProps) {
    return(
        <a className="bookmark" href={props.url}>
            <img alt="Bookmark icon" src={props.icon}></img>
            <span>{props.name}</span>
        </a>
    );
}

export default Bookmark;