import React, {useEffect} from "react";
import {ActiveDrag} from "./Body.tsx";
import CreateFolderIcon from "../assets/create_folder.svg?react"

function DropTarget(props: {children: React.ReactNode, className: string, onDrop: () => void}) {
    let [drop, setDrop] = React.useState(false);
    let [activeDrag, _] = React.useContext(ActiveDrag);

    useEffect(() => {
        setDrop(false);
    }, [activeDrag]);

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDrop(true)
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        setDrop(false)
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        props.onDrop();
    }

    return (
        <div className={props.className} style={drop ? undefined : {opacity: 0}}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {props.children}
        </div>
    );
}

function DropTargets(props: { onDropLeft: () => void, onDropRight: () => void, onDropCenter: () => void }) {

    return (
        <div className={"drop-targets"}>
            <DropTarget className={"left"} onDrop={props.onDropLeft}>
                <div/>
            </DropTarget>
            <DropTarget className={"right"} onDrop={props.onDropRight}>
                <div/>
            </DropTarget>
            <DropTarget className={"center"} onDrop={props.onDropCenter}>
                <CreateFolderIcon/>
            </DropTarget>
        </div>
    );
}

export default DropTargets;