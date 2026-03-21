import React, {ReactElement, useEffect, useId, useState} from "react";
//
// function RadioEntry(props: {value: any, children: ReactElement}) {
//     return props.children
// }

/**
 * A component for a group of radio buttons where only one can be selected
 *
 * @param props.children html <option> elements for each radio option
 * @param props.value The option which is selected
 * @param props.onChange A function that will be called when the selected option changes
 */
function RadioButtonGroup(props: { children: {props: {value: any, children: ReactElement}}[], value: any, onChange?: (arg0: any) => void }) {
    const [selected, setSelected] = useState(props.value);
    useEffect(() => {
        setSelected(props.value);
    }, [props.value]);
    useEffect(() => {
        props.onChange && props.onChange(selected);
    }, [selected])

    return (
        <div className="radio-group">
            { props.children && props.children.map((item) => (
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