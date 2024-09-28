import Bookmark from "./Bookmark.tsx";
import Folder from "./Folder.tsx"

function App() {
    return (
        <Folder name="root">
            <Bookmark name="Best website ever" url="https://sowgro.net/"/>
            <Bookmark name="Google" url="https://google.com/"/>
            <Folder name="subfolder">
                <Bookmark name="example" url="https://example.com"/>
            </Folder>
        </Folder>
    )
}

export default App
