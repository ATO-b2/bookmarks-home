import {getBrowser} from "../main.tsx";
import IconPicker from "./IconPicker.tsx";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

function BookmarkEditor(props: {bmData: BookmarkTreeNode}) {

    function updateBookmark(newData: {}) {
        console.log("updated bookmark") // TODO toast this
        getBrowser().bookmarks.update(props.bmData.id, newData)
    }

    let isFolder = !props.bmData.url

    return (<>
        <h1>Edit {isFolder ? "Folder" : "Bookmark"}</h1>

        <h3>Name</h3>
        <input
            type={"text"}
            defaultValue={props.bmData.title}
            onBlur={e => updateBookmark({title: e.target.value})}
        />

        {!isFolder && (<>
            <h3>URL</h3>
            <input
                type={"url"}
                defaultValue={props.bmData.url}
                onBlur={e => updateBookmark({url: e.target.value})}
            />

            <h3>Icon</h3>
            <IconPicker bmData={props.bmData}/>
        </>)}
    </>)
}

export default BookmarkEditor;