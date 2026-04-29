import React, {ReactElement, useEffect, useId, useState} from "react";

type OptionElement = {props: {value: string, children: ReactElement}} | undefined | false | null;

function RadioButtonGroup(props: { children: OptionElement[], value: string, onChange?: (arg0: string) => void }) {
    const [selected, setSelected] = useState(props.value);

    useEffect(() => {
        setSelected(props.value);
    }, []);

    useEffect(() => {
        props.onChange && props.onChange(selected);
    }, [selected])

    return (
        <div className="radio-group">
            { props.children.map((item) => item && (
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