import type {ReactNode} from "react";


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


interface SelectProps extends BaseInputProps {
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


export function SelectComponent({id, label, onChange, children}: SelectProps) {
    return (
        <>
            <label htmlFor={id} className="col-sm-2 col-form-label">{label}</label>
            <select
                className="form-select"
                aria-label="Default select example"
                id={id}
                onChange={(event) => onChange(event.target.value)}
            >
                {children}
            </select>
        </>
    )
}