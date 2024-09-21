function Bookmark(url: string, img: string, name: string) {
    return(
        <a class="bookmark" href={url}>
            <img src={img}></img>
            <span>{name}</span>
        </a>
    );
}

function Folder(children: any, name: string) {
    return(
        <div class="folder">
            <span>{name}</span>
            <div>
                {children}
            </div>
        </div>
    )
}