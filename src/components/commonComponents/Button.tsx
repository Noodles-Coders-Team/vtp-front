export enum ButtonType {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SUCCESS = 'success',
    ERROR = 'danger',
    WARNING = 'warning',
    INFO = 'info',
    LIGHT = 'light',
    DARK = 'dark',
    LINK = 'link'
}

interface ButtonProps {
    label: string
    type: ButtonType,
    onClick: () => void,
    style?: React.CSSProperties | undefined
}

export default function Button({label, type, onClick, style = {}}: ButtonProps) {
    return (
        <button type="button"
                className={`btn btn-${type.toString()}`}
                onClick={onClick}
                style={{margin: 10, ...style}}>
            {label}
        </button>
    )
}