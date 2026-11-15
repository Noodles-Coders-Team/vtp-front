import type {ButtonType} from "@/enum/ButtonType.ts";


interface ButtonProps {
    label: string
    type: ButtonType,
    onClick: () => void,
    style?: React.CSSProperties | undefined,
    tooltip?: string
}


export default function Button({label, type, onClick, style = {}, tooltip}: ButtonProps) {

    return (
        <button type="button"
                className={`btn-solid theme-${type.toString()}`}
                data-bs-toggle="tooltip"
                data-bs-title={tooltip}
                onClick={onClick}
                style={{margin: 10, ...style}}
        >
            {label}
        </button>
    )
}
