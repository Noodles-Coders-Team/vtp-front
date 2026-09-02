interface InputProps {
    id: string,
    label: string,
    placeholder: string,
    type?: string,
    value: string,
    onChange: (value: string) => void
}

export function InputComponent({ id, label, placeholder, type = "text", value, onChange }: InputProps) {
    return (
        <>
            <label htmlFor={id}>{label}</label>
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