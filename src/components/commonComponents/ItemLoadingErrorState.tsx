import type {ReactNode} from "react";

interface InputProps {
    label: string;
    loading: boolean;
    error: string | null;
    children: ReactNode;
}


export function ItemLoadingErrorState({label, loading, error, children}: InputProps) {
    return (
        <div>
            {loading && <p>Loading {label}...</p>}
            {error && <p style={{color: "red"}}>Error loading {label}: {error}</p>}
            {!loading && !error && children}
        </div>
    )
}