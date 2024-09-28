interface FolderProps {
    name: string;
    children?: React.ReactNode;
}

function Folder (props: FolderProps) {
    return (
        <div className="folder">
            <span>{props.name}</span>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default Folder;