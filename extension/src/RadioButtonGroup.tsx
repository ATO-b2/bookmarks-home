import React, {useId, useState} from "react";

interface radioEntry {
    label: string,
    data: any,
}

interface IProps {
    groupLabel: string,
    items: radioEntry[],
    defaultData: any
}

function RadioButtonGroup(props: IProps) {
    const [selected, setSelected] = useState(props.defaultData);

    return (
        <>
            <h3>{props.groupLabel}</h3>
            <div className="radio-group">
                { props.items.map((item) => (
                    <label>
                        <input
                            type="radio"
                            name={useId()}
                            value={item.data}
                            checked={item.data === selected}
                            onChange={e => setSelected(e.target.value)}
                        />
                        {item.label}
                    </label>
                )) }
            </div>
            <span>currently selected: {selected}</span>
        </>
    )
}

export default RadioButtonGroup

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