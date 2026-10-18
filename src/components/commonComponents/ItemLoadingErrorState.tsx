import type {ReactNode} from "react";


interface InputProps {
    label: string;
    loading: boolean;
    error: string | null;
    children: ReactNode;
}


export function ItemLoadingErrorState({label, loading, error, children}: InputProps) {
    return (
        <div style={{borderStyle: "solid", borderColor: "grey", borderWidth: 1, borderRadius: 10}}>
            {loading &&
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading {loading}...</span>
                </div>}
            {error && <p style={{color: "red"}}>Error loading {label}: {error.substring(0, 400)}</p>}
            {!loading && !error && children}
        </div>
    )
}