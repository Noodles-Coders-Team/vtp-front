import {useEffect, useRef, type ReactNode} from "react";


interface BaseInputProps {
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
}


interface InputProps extends BaseInputProps {
    placeholder?: string,
    type?: string,
}


const COMBOBOX_CHANGE_EVENT = "change.bs.combobox";
type ComboboxChangeEvent = Event & { value: string | string[] };


interface SelectProps extends Omit<BaseInputProps, "value"> {
    toolTip?: string,
    children: ReactNode,
}


interface SelectComponentItemProps {
    value: string,
    label: string,
}


export function InputComponent({id, label, placeholder = "", type = "text", value, onChange}: InputProps) {
    return (
        <>
            <label htmlFor={id} className="col-sm-2 col-form-label">{label}</label>
            <input
                className="form-control"
                id={id}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </>
    )
}


interface InputNumberProps {
    id: string,
    value: string,
    onChange: (value: number, id: string) => void,
}


export function InputNumber({id, value, onChange}: InputNumberProps) {
    return (
        <input
            className="form-control"
            id={id}
            type="number"
            value={value}
            onChange={(event) => onChange(Number(event.target.value), id)}
        />
    )
}


export function SelectComponent({id, label, children, toolTip, onChange}: SelectProps) {

    const toggleRef = useRef<HTMLButtonElement>(null);

    // Bootstrap stops propagation in the capture phase on `.menu`, so a click on an item never reaches
    // React's root listener. The combobox change event on the toggle is the only usable hook.
    useEffect(() => {
        const toggle = toggleRef.current;
        if (toggle == null) {
            return;
        }
        const onComboboxChange = (event: Event) => {
            const {value} = event as ComboboxChangeEvent;
            onChange(Array.isArray(value) ? value[0] : value);
        };
        toggle.addEventListener(COMBOBOX_CHANGE_EVENT, onComboboxChange);
        return () => toggle.removeEventListener(COMBOBOX_CHANGE_EVENT, onComboboxChange);
    }, [onChange]);

    return (
        <div className="form-field">
            <label htmlFor={`${id}ComboBox`} className="form-label">{label}</label>
            <button className="form-control combobox-toggle" type="button"
                    id={`${id}ComboBox`}
                    ref={toggleRef}
                    data-bs-toggle="combobox"
                    data-bs-placeholder={toolTip}>
                <span className="combobox-value">{toolTip}</span>
                <svg className="combobox-caret" width="10" height="16" viewBox="0 0 10 16" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.46967 5.46967C0.762563 5.17678 1.23744 5.17678 1.53033 5.46967L5 8.93934L8.46967 5.46967C8.76256 5.17678 9.23744 5.17678 9.53033 5.46967C9.82322 5.76256 9.82322 6.23744 9.53033 6.53033L5.53033 10.5303C5.23744 10.8232 4.76256 10.8232 4.46967 10.5303L0.46967 6.53033C0.176777 6.23744 0.176777 5.76256 0.46967 5.46967Z"
                        fill="currentcolor"/>
                </svg>
            </button>
            <div className="menu">
                {children}
            </div>
        </div>
    )
}


export function SelectComponentItem({value, label}: SelectComponentItemProps) {
    return (
        <button className="menu-item" type="button" data-bs-value={value}>{label}</button>
    )
}