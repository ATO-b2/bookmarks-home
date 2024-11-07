import React, {ReactElement, useEffect, useId, useState} from "react";

interface RadioProps {
    children: ReactElement<HTMLOptionElement>[],
    value: any,
    onChange?: (arg0: any) => void
}

function RadioButtonGroup(props: RadioProps) {
    const [selected, setSelected] = useState(props.value);
    useEffect(() => {
        setSelected(props.value);
    }, [props.value]);
    useEffect(() => {
        props.onChange && props.onChange(selected);
    }, [selected])

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