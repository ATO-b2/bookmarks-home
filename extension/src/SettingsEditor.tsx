import RadioButtonGroup from "./RadioButtonGroup.tsx";
import React, {useState} from "react";

function SettingsEditor() {
    const [selected, setSelected] = useState('0');

    return (
        <form>
            <RadioButtonGroup groupLabel="Background Type" defaultData={"fromTheme"} items={[
                {label: "From Theme", data: "fromTheme"},
                {label: "Solid Color", data: "solidColor"},
                {label: "Image", data: "image"},
            ]}/>
            <RadioButtonGroup groupLabel="Sort" defaultData={"fromBookmarks"} items={[
                {label: "From Bookmarks", data: "fromBookmarks"},
                {label: "Alphabetical", data: "alphabetical"},
                {label: "Frequency", data: "frequency"},
                {label: "Recently used", data: "recent"},
            ]}/>

            <h3>Root folder</h3>
            <select onChange={e => setSelected(e.target.value)}>
                <option value={'0'}>Bookmarks Toolbar id:0</option>
                <option value={'1'}>Mobile Bookmarks id:1</option>
                <option value={'2'}>Other Bookmarks id:2</option>
            </select>
            <span>currently selected: {selected}</span>
        </form>
    )
}

export default SettingsEditor;

// <div id="settings-menu">
//     <h2>Settings</h2>
//
//     <h3>Sort</h3>
//     <label>
//         <input type="radio" name="sort"/>
//         From bookmarks
//     </label>
//     <label>
//         <input type="radio" name="sort"/>
//         Alphabetical
//     </label>
//     <label>
//         <input type="radio" name="sort"/>
//         Frequency
//     </label>
//
//     <h3>Background</h3>
//     <label>
//         <input type="radio" name="bg"/>
//         From Theme
//     </label>
//     <label>
//         <input type="radio" name="bg"/>
//         Solid color
//     </label>
//     <label>
//         <input type="radio" name="bg"/>
//         Image
//     </label>
//
//     <h3>Root folder</h3>
//     <label>
//         <select>
//             <option>Bookmarks Toolbar id:0</option>
//             <option>Mobile Bookmarks id:1</option>
//             <option>Other Bookmarks id:2</option>
//         </select>
//     </label>
// </div>