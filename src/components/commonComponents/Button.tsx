import type {ButtonType} from "@/enum/ButtonType.ts";


interface ButtonProps {
    label: string
    type: ButtonType
    onClick: () => void
    style?: React.CSSProperties | undefined
    tooltip?: string
    subtle?: boolean
}


export default function Button({label, type, onClick, style = {}, tooltip, subtle = false}: ButtonProps) {
    const buttonState = subtle ? `btn-subtle` : `btn-solid`;

    return (
        <button type="button"
                className={`${buttonState} theme-${type.toString()}`}
                data-bs-toggle="tooltip"
                data-bs-title={tooltip}
                onClick={onClick}
                style={{margin: 10, ...style}}
        >
            {label}
        </button>
    )
}
