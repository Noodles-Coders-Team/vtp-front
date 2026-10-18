import type {ReactNode} from "react";


interface BaseInput {
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
}


interface InputProps extends BaseInput {
    placeholder?: string,
    type?: string,
}


interface SelectProps extends BaseInput {
    children: ReactNode,
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


export function SelectComponent({id, label, value, onChange, children}: SelectProps) {
    return (
        <>
            <label htmlFor={id} className="col-sm-2 col-form-label">{label}</label>
            <select
                className="form-select"
                aria-label="Default select example"
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                {children}
            </select>
        </>
    )
}