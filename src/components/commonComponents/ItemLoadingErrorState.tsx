import type {ReactNode} from "react";


interface InputProps {
    label: string;
    loading: boolean;
    error: string | null;
    border?: boolean;
    children: ReactNode;
}


export function ItemLoadingErrorState({label, loading, error, children, border = true}: InputProps) {
    let style = {};
    if (border)
        style = {borderStyle: "solid", borderColor: "grey", borderWidth: 1, borderRadius: 10};

    return (
        <div style={style}>
            {loading &&
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading {loading}...</span>
                </div>}
            {error && <p style={{color: "red"}}>Error loading {label}: {error.substring(0, 400)}</p>}
            {!loading && !error && children}
        </div>
    )
}