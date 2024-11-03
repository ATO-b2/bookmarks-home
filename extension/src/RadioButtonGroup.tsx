import React, {ReactElement, ReactNode, useId, useState} from "react";

interface RadioProps {
    children: ReactElement<HTMLOptionElement>[],
    defaultValue: any,
    onChange?: (arg0: any) => void
}

function RadioButtonGroup(props: RadioProps) {
    const [selected, setSelected] = useState(props.defaultValue);
    props.onChange && props.onChange(selected);

    return (
        <div className="radio-group">
            { props.children.map((item) => (
                <label>
                    <input
                        type="radio"
                        name={useId()}
                        value={item.props.value}
                        checked={item.props.value === selected}
                        onChange={e => setSelected(e.target.value)}
                    />
                    {item.props.children.toString()}
                </label>
            )) }
        </div>
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